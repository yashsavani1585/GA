
import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

// --- Adjust these model import paths to match your project ---
import Auction from "../models/auctionModel.js";
import Deposit from "../models/Deposit.js";
import PaymentRecord from "../models/PaymentRecord.js";
import User from "../models/userModel.js";
// ----------------------------------------------------------

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.RZP_KEY_ID || "rzp_test_z8VHG8l7lxwyLF";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.RZP_KEY_SECRET || "MJGRuvCiarfUxZyQzkhbt8DZ";
const FRONTEND_URL = (process.env.FRONTEND_URL || process.env.FRONTEND_BASE_URL || "http://localhost:5173").replace(/\/$/, "");
const JWT_SECRET = process.env.JWT_SECRET || "changeme123";



if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ Missing Razorpay keys in .env (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET).");
}
if (!JWT_SECRET) {
  console.warn("⚠️ Missing JWT_SECRET in .env (optionalAuth will skip auth if missing).");
}

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
  key_secret: RAZORPAY_KEY_SECRET || "MJGRuvCiarfUxZyQzkhbt8DZ",
});

/* -------------------------
   Helper: receipts & checkout
   ------------------------- */
function safeReceipt({ prefix = "rcpt", auctionId = "", userId = "" } = {}) {
  const a = String(auctionId || "").replace(/[^a-zA-Z0-9]/g, "");
  const u = String(userId || "").replace(/[^a-zA-Z0-9]/g, "");
  const ts = String(Date.now()).slice(-6);
  const aShort = a.slice(-8) || "A";
  const uShort = u.slice(-6) || "U";
  let r = `${prefix}_${aShort}_${uShort}_${ts}`;
  if (r.length > 40) r = r.slice(0, 40);
  return r;
}

async function createRazorpayOrder(amountPaise, { receipt = null, notes = {} } = {}) {
  if (!amountPaise || typeof amountPaise !== "number" || amountPaise <= 0) {
    throw new Error("Invalid amountPaise (must be positive integer paise)");
  }
  const payload = {
    amount: Math.round(amountPaise),
    currency: "INR",
    receipt: receipt ? String(receipt).slice(0, 40) : safeReceipt({ prefix: "rcpt" }),
    payment_capture: 1, // auto-capture
    notes: notes || {},
  };
  try {
    const order = await razorpayInstance.orders.create(payload);
    console.log(`✅ Razorpay order created: id=${order.id} amountPaise=${payload.amount}`);
    return order;
  } catch (err) {
    const msg = err?.error_description || err?.message || String(err);
    console.error("❌ createRazorpayOrder error:", msg);
    throw err;
  }
}
export async function createDepositOrderForAuction({ auctionId, userId, amountPaise: requestedAmountPaise = null }) {
  if (!auctionId || !userId) throw new Error("Missing auctionId/userId");

  const auction = await Auction.findById(auctionId).lean();
  if (!auction) throw new Error("Auction not found");

  // determine base price in paise
  let basePaise = auction.startingPricePaise ?? auction.currentPricePaise;
  if (!basePaise) {
    if (auction.startingPrice) basePaise = Math.round(Number(auction.startingPrice) * 100);
    else throw new Error("Auction price not available");
  }

  const depositPercent = auction.depositPercent ?? 25;
  const computedDepositPaise = Math.ceil((basePaise * depositPercent) / 100);

  // decide final depositPaise; prefer server computed value (safer)
  let depositPaise;
  if (requestedAmountPaise && Number(requestedAmountPaise) > 0) {
    // accept only if equals computed (prevents client tamper), else use computed
    depositPaise = Number(requestedAmountPaise) === Number(computedDepositPaise) ? Number(requestedAmountPaise) : computedDepositPaise;
  } else depositPaise = computedDepositPaise;

  const receipt = safeReceipt({ prefix: "dep", auctionId, userId });

  // create Razorpay order
  let rzpOrder;
  try {
    rzpOrder = await createRazorpayOrder(depositPaise, { receipt, notes: { auctionId, userId, type: "deposit" } });
  } catch (err) {
    // rethrow normalized error
    throw err;
  }

  // upsert deposit doc
  let deposit = await Deposit.findOne({ user: userId, auction: auctionId });
  if (!deposit) {
    deposit = await Deposit.create({
      user: userId,
      auction: auctionId,
      amountPaise: depositPaise,
      razorpayOrderId: rzpOrder.id,
      status: "pending",
    });
  } else {
    deposit.razorpayOrderId = rzpOrder.id;
    deposit.amountPaise = depositPaise;
    deposit.status = "pending";
    deposit.updatedAt = new Date();
    await deposit.save();
  }

  return { success: true, order: rzpOrder, depositId: deposit._id, key: RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID };
}

export async function verifyAndFinalizeDeposit({ depositId, razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
  if (!depositId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) throw new Error("Missing fields");

  const deposit = await Deposit.findById(depositId).populate("auction").populate("user", "name email");
  if (!deposit) throw new Error("Deposit not found");

  const ok = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!ok) {
    deposit.status = "pending";
    await deposit.save();
    throw new Error("Invalid signature");
  }

  deposit.razorpayPaymentId = razorpay_payment_id;
  deposit.razorpaySignature = razorpay_signature;
  deposit.status = "paid";
  deposit.updatedAt = new Date();
  await deposit.save();

  console.log(`✅ Deposit verified and marked paid: depositId=${depositId} auction=${deposit.auction?._id} user=${deposit.user?._id}`);

  return deposit;
}

function verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  const secret = RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Missing RAZORPAY_KEY_SECRET env var");
  const generated = crypto.createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  return generated === razorpay_signature;
}

export function buildFrontendCheckoutUrl({
  razorpayOrderId = "",
  auctionId = "",
  productName = "",
  amountPaise = 0,
}) {
  return `${FRONTEND_URL}/checkout?order_id=${encodeURIComponent(
    razorpayOrderId
  )}&auction=${encodeURIComponent(
    auctionId
  )}&product=${encodeURIComponent(
    productName || ""
  )}&amount=${encodeURIComponent(amountPaise)}`;
}







/* -------------------------
   Business helpers
   ------------------------- */

/**
 * computePaiseFromAuction(auction)
 * Robustly return final/current/starting price (paise)
 */
function computePaiseFromAuction(auction = {}) {
  if (!auction) return 0;
  const pick =
    auction.finalPricePaise ??
    auction.currentPricePaise ??
    (auction.currentPrice != null ? Math.round(Number(auction.currentPrice) * 100) : null) ??
    auction.startingPricePaise ??
    (auction.startingPrice != null ? Math.round(Number(auction.startingPrice) * 100) : 0);
  return Number(pick || 0);
}

/* -------------------------
   Core: generatePaymentLink
   - resolves finalPaise
   - applies paid deposit if present
   - creates Razorpay order only for amountDue > 0
   - saves PaymentRecord with deposit details
   ------------------------- */
// export async function generatePaymentLink({
//   auctionId,
//   userId,
//   amountPaise = null,
//   productName = "",
//   address = {},
//   depositPercent = null,
//   depositAmountPaise = null,
// }) {
//   try {
//     if (!auctionId || !userId) return { success: false, error: "Missing auctionId or userId" };

//     const auction = await Auction.findById(auctionId).lean();
//     if (!auction) return { success: false, error: "Auction not found" };

//     // resolve finalPaise
//     let finalPaise = null;
//     if (amountPaise != null && !isNaN(amountPaise) && Number(amountPaise) > 0) {
//       finalPaise = Math.round(Number(amountPaise));
//     } else {
//       finalPaise = computePaiseFromAuction(auction);
//     }
//     if (!finalPaise || finalPaise <= 0) return { success: false, error: "Invalid final auction amount (paise)" };

//     // find paid deposit for user+auction
//     let appliedDepositPaise = 0;
//     const depositRecord = await Deposit.findOne({ user: userId, auction: auctionId, status: "paid" }).lean();
//     if (depositRecord && depositRecord.amountPaise) {
//       appliedDepositPaise = Number(depositRecord.amountPaise);
//       console.log(`apply deposit from record: depositId=${depositRecord._id} amountPaise=${appliedDepositPaise}`);
//     } else {
//       // no paid deposit recorded — compute assumed deposit
//       if (depositAmountPaise != null && Number(depositAmountPaise) > 0) {
//         appliedDepositPaise = Math.round(Number(depositAmountPaise));
//       } else if (auction.depositAmountPaise != null && Number(auction.depositAmountPaise) > 0) {
//         appliedDepositPaise = Math.round(Number(auction.depositAmountPaise));
//       } else {
//         const pct = depositPercent != null ? Number(depositPercent) : auction.depositPercent != null ? Number(auction.depositPercent) : 25;
//         appliedDepositPaise = Math.round((Number(finalPaise) * (pct || 25)) / 100);
//       }
//       // NOTE: appliedDepositPaise here is assumed only (won't be considered "paid" unless Deposit record exists)
//       console.log(`no paid deposit -> using default depositPaise=${appliedDepositPaise}`);
//     }

//     if (appliedDepositPaise > finalPaise) appliedDepositPaise = finalPaise;

//     const amountDuePaise = Math.max(0, Math.round(Number(finalPaise) - Number(appliedDepositPaise)));

//     // create razorpay order only if amountDuePaise > 0
//     let rzpOrder = null;
//     let checkoutUrl = null;
//     const receipt = safeReceipt({ prefix: "pay", auctionId, userId });

//     if (amountDuePaise > 0) {
//       try {
//         rzpOrder = await createRazorpayOrder(amountDuePaise, {
//           receipt,
//           notes: {
//             auctionId,
//             userId,
//             productName: productName || auction.productName || "",
//             type: "final",
//             depositAppliedPaise: appliedDepositPaise,
//           },
//         });
//         checkoutUrl = generateCheckoutUrl(rzpOrder.id, auctionId, amountDuePaise);
//       } catch (err) {
//         console.error("generatePaymentLink createRazorpayOrder failed:", err);
//         return { success: false, error: err?.description || err?.message || "Razorpay order creation failed" };
//       }
//     } else {
//       // nothing to pay (deposit covers full amount)
//       console.log("Payment due is 0 — no Razorpay order created (deposit covers amount).");
//     }

//     // save PaymentRecord
//     const paymentDoc = await PaymentRecord.create({
//       user: userId,
//       auction: auctionId,
//       razorpayOrderId: rzpOrder?.id || null,
//       amountPaise: finalPaise, // final total price
//       depositPaise: appliedDepositPaise,
//       amountDuePaise,
//       currency: "INR",
//       status: amountDuePaise > 0 ? "PENDING" : "PAID_BY_DEPOSIT",
//       providerResponse: rzpOrder || null,
//       address,
//       receipt: rzpOrder?.receipt || receipt,
//       checkoutUrl,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     console.log(`✅ PaymentRecord saved: id=${paymentDoc._id} finalPaise=${finalPaise} depositPaise=${appliedDepositPaise} amountDuePaise=${amountDuePaise}`);

//     return {
//       success: true,
//       checkoutUrl,
//       orderDb: paymentDoc,
//       amountPaise: finalPaise,
//       depositPaise: appliedDepositPaise,
//       amountDuePaise,
//     };
//   } catch (err) {
//     console.error("❌ generatePaymentLink ERROR:", err && (err.message || err));
//     return { success: false, error: err.message || String(err) };
//   }
// }

// export async function generatePaymentLink({
//   auctionId,
//   userId,
//   amountPaise = null,
//   productName = "",
//   address = {},
//   depositPercent = null,
//   depositAmountPaise = null,
// }) {
//   try {
//     if (!auctionId || !userId) return { success: false, error: "Missing auctionId or userId" };

//     const auction = await Auction.findById(auctionId).lean();
//     if (!auction) return { success: false, error: "Auction not found" };

//     // resolve finalPaise
//     let finalPaise = null;
//     if (amountPaise != null && !isNaN(amountPaise) && Number(amountPaise) > 0) {
//       finalPaise = Math.round(Number(amountPaise));
//     } else {
//       finalPaise = computePaiseFromAuction(auction);
//     }
//     if (!finalPaise || finalPaise <= 0) return { success: false, error: "Invalid final auction amount (paise)" };

//     // determine applied deposit
//     let appliedDepositPaise = 0;
//     const depositRecord = await Deposit.findOne({ user: userId, auction: auctionId, status: "paid" }).lean();
//     if (depositRecord && depositRecord.amountPaise) {
//       appliedDepositPaise = Number(depositRecord.amountPaise);
//     } else {
//       if (depositAmountPaise != null && Number(depositAmountPaise) > 0) {
//         appliedDepositPaise = Math.round(Number(depositAmountPaise));
//       } else if (auction.depositAmountPaise != null && Number(auction.depositAmountPaise) > 0) {
//         appliedDepositPaise = Math.round(Number(auction.depositAmountPaise));
//       } else {
//         const pct = depositPercent != null ? Number(depositPercent) : auction.depositPercent != null ? Number(auction.depositPercent) : 25;
//         appliedDepositPaise = Math.round((Number(finalPaise) * (pct || 25)) / 100);
//       }
//     }
//     if (appliedDepositPaise > finalPaise) appliedDepositPaise = finalPaise;

//     const amountDuePaise = Math.max(0, Math.round(Number(finalPaise) - Number(appliedDepositPaise)));

//     // receipt
//     const receipt = safeReceipt({ prefix: "pay", auctionId, userId });

//     // rzpOrder may be created (Orders API)
//     let rzpOrder = null;
//     let checkoutUrl = null;
//     let pref = null;

//     if (amountDuePaise > 0) {
//       // 1) Create Orders API order (server-side)
//       try {
//         rzpOrder = await createRazorpayOrder(amountDuePaise, {
//           receipt,
//           notes: {
//             auctionId,
//             userId,
//             productName: productName || auction.productName || "",
//             type: "final",
//             depositAppliedPaise: appliedDepositPaise,
//           },
//         });
//         console.log("createRazorpayOrder -> order.id:", rzpOrder?.id);
//       } catch (err) {
//         console.error("generatePaymentLink createRazorpayOrder failed:", err?.response?.data || err?.message || err);
//         return { success: false, error: "Razorpay order creation failed" };
//       }

//       // 2) Try to create server-side standard checkout preference (v1 endpoint)
//       try {
//         const prefBody = {
//           amount: amountDuePaise,
//           currency: "INR",
//           customer: { email: auction?.email || "", name: auction?.sellerName || "" },
//           notes: {
//             auctionId,
//             userId,
//             order_id: rzpOrder.id,
//             productName: productName || auction.productName || "",
//             type: "final",
//             depositAppliedPaise: appliedDepositPaise,
//           },
//           checkout: {
//             mode: "payment",
//             redirect: { url: `${FRONTEND_BASE_URL}/checkout-callback` },
//           },
//         };

//         const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
//         const resp = await axios.post("https://api.razorpay.com/v1/standard_checkout/preferences", prefBody, {
//           headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
//           timeout: 20000,
//         });

//         pref = resp.data || {};
//         checkoutUrl = pref.checkout_url || pref.launch_url || null;

//         if (checkoutUrl) {
//           console.log("Preference created, checkoutUrl provided by Razorpay.");
//         } else {
//           console.warn("Preference created but no checkout_url returned by Razorpay (pref object):", pref);
//         }
//       } catch (err) {
//         // preference creation failed: log full server response for debugging
//         console.error("create preference (server) failed:", err?.response?.status, err?.response?.data || err?.message || err);
//         // leave checkoutUrl null — we will create a safe fallback below
//       }

//       // 3) If preference creation failed or returned no checkoutUrl, create a fallback frontend URL
//       if (!checkoutUrl && rzpOrder && rzpOrder.id) {
//         // fallback: open your frontend checkout page which knows how to handle order_id -> popup
//         checkoutUrl = `${FRONTEND_BASE_URL.replace(/\/$/, "")}/checkout?orderId=${encodeURIComponent(rzpOrder.id)}&auctionId=${encodeURIComponent(auctionId)}&amountPaise=${encodeURIComponent(amountDuePaise)}`;
//         console.log("Fallback checkoutUrl generated (frontend will use order_id popup):", checkoutUrl);
//       }
//     } else {
//       // amountDuePaise === 0 => fully covered by deposit
//       console.log("Payment due is 0 — deposit covers the amount. No order required.");
//       // mark as paid_by_deposit and set checkoutUrl to your frontend confirmation page (optional)
//       checkoutUrl = `${FRONTEND_BASE_URL.replace(/\/$/, "")}/payment-success?mode=paid_by_deposit&auctionId=${encodeURIComponent(auctionId)}`;
//     }

//     // persist PaymentRecord with whatever we obtained (order + pref + checkoutUrl)
//     const paymentDoc = await PaymentRecord.create({
//       user: userId,
//       auction: auctionId,
//       razorpayOrderId: rzpOrder?.id || null,
//       razorpayPreferenceId: pref?.id || null,
//       amountPaise: finalPaise,
//       depositPaise: appliedDepositPaise,
//       amountDuePaise,
//       currency: "INR",
//       status: amountDuePaise > 0 ? "PENDING" : "PAID_BY_DEPOSIT",
//       providerResponse: pref || rzpOrder || null,
//       address,
//       receipt: rzpOrder?.receipt || receipt,
//       checkoutUrl: checkoutUrl || null,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     console.log(`✅ PaymentRecord saved: id=${paymentDoc._id} finalPaise=${finalPaise} depositPaise=${appliedDepositPaise} amountDuePaise=${amountDuePaise} checkoutUrl=${checkoutUrl ? "YES" : "NO"}`);

//     // return consistent payload (frontend expects checkoutUrl to open)
//     return {
//       success: true,
//       checkoutUrl,
//       orderDb: paymentDoc,
//       amountPaise: finalPaise,
//       depositPaise: appliedDepositPaise,
//       amountDuePaise,
//       razorpayOrderId: rzpOrder?.id || null,
//       preference: pref || null,
//     };
//   } catch (err) {
//     console.error("❌ generatePaymentLink ERROR:", err && (err.message || err));
//     return { success: false, error: err.message || String(err) };
//   }
// }
export async function createPaymentLinkSafe(payload) {
  try {
    const link = await razorpayInstance.paymentLink.create(payload);
    return { success: true, paymentLink: link };
  } catch (err) {
    // capture axios-like response body if present (Razorpay SDK surface)
    const details = err?.error || err?.response?.data || err?.error_description || err;
    return { success: false, error: err, details };
  }
}




export async function generatePaymentLink({
  auctionId,
  userId,
  amountPaise = null,
  depositPercent = null,
  depositAmountPaise = null,
  productName = "",
  address = {},
}) {
  try {
    if (!auctionId || !userId) return { success: false, error: "Missing auctionId or userId" };

    const auction = await Auction.findById(auctionId).lean();
    if (!auction) return { success: false, error: "Auction not found" };

    // determine finalPaise (paise)
    let finalPaise =
      amountPaise != null && !isNaN(amountPaise) && Number(amountPaise) > 0
        ? Math.round(Number(amountPaise))
        : computePaiseFromAuction(auction);

    if (!finalPaise || finalPaise <= 0) return { success: false, error: "Invalid final amount (paise)" };

    // compute deposit applied (paise)
    let appliedDepositPaise = 0;
    const depositRecord = await Deposit.findOne({ user: userId, auction: auctionId, status: "paid" }).lean();
    if (depositRecord && depositRecord.amountPaise) {
      appliedDepositPaise = Number(depositRecord.amountPaise);
    } else if (depositAmountPaise != null && Number(depositAmountPaise) > 0) {
      appliedDepositPaise = Math.round(Number(depositAmountPaise));
    } else if (auction.depositAmountPaise != null && Number(auction.depositAmountPaise) > 0) {
      appliedDepositPaise = Math.round(Number(auction.depositAmountPaise));
    } else {
      const pct = depositPercent != null ? Number(depositPercent) : auction.depositPercent != null ? Number(auction.depositPercent) : 25;
      appliedDepositPaise = Math.round((Number(finalPaise) * (pct || 25)) / 100);
    }
    if (appliedDepositPaise > finalPaise) appliedDepositPaise = finalPaise;

    const amountDuePaise = Math.max(0, Math.round(Number(finalPaise) - Number(appliedDepositPaise)));

    // Optionally create a Razorpay Order (non-fatal) — useful for popup
    let razorpayOrder = null;
    if (amountDuePaise > 0) {
      try {
        razorpayOrder = await razorpayInstance.orders.create({
          amount: amountDuePaise,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          payment_capture: 1,
          notes: {
            auctionId,
            userId,
            productName: productName || auction.productName || "",
            depositAppliedPaise: appliedDepositPaise,
            type: "final",
          },
        });
      } catch (err) {
        console.warn("Order create failed (non-fatal):", err?.error || err?.message || err);
        razorpayOrder = null;
      }
    }

    // Build Payment Link payload
    const linkPayload = {
      amount: amountDuePaise > 0 ? amountDuePaise : finalPaise,
      currency: "INR",
      accept_partial: false,
      description: productName || auction.productName || "Auction payment",
      reference_id: razorpayOrder ? razorpayOrder.id : `rcpt_${Date.now()}`,
      notify: { sms: !!address?.mobile, email: !!address?.email },
      notes: {
        auctionId,
        userId,
        depositAppliedPaise: appliedDepositPaise,
        razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
      },
    };

    // attach customer only when fields are present
    const customerObj = {};
    if (address?.fullName) customerObj.name = address.fullName;
    else if (auction?.sellerName) customerObj.name = auction.sellerName;
    if (address?.mobile) customerObj.contact = String(address.mobile);
    if (address?.email) customerObj.email = String(address.email);
    if (Object.keys(customerObj).length > 0) linkPayload.customer = customerObj;

    // create payment link using safe wrapper
    const createResult = await createPaymentLinkSafe(linkPayload);
    const paymentLink = createResult.success ? createResult.paymentLink : null;

    // extract short url & id
    let razorpayShortUrl = null;
    let paymentLinkId = null;
    if (paymentLink) {
      // some SDKs return link directly; handle shape robustly
      razorpayShortUrl = paymentLink.short_url || paymentLink.long_url || (paymentLink.data && (paymentLink.data.short_url || paymentLink.data.long_url)) || null;
      paymentLinkId = paymentLink.id || (paymentLink.data && paymentLink.data.id) || null;
    }

    if (!createResult.success) {
      console.warn("Payment link creation failed:", createResult.details || createResult.error || "no details");
    }

    // generate a stable order_id for PaymentRecord (required by schema)
    const generatedOrderId = paymentLinkId || (razorpayOrder && razorpayOrder.id) || `pr_${Date.now()}`;

    // Save PaymentRecord (always persist, even if link failed)
    const paymentDoc = await PaymentRecord.create({
      user: userId,
      auction: auctionId,
      order_id: generatedOrderId,
      razorpayOrderId: razorpayOrder?.id || null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paymentRef: paymentLinkId || null,
      items: [
        {
          productId: auctionId,
          name: productName || auction.productName || "Auction Item",
          quantity: 1,
          price: Math.round(finalPaise / 100),
          image: auction.image || auction.productImage || null,
        },
      ],
      amountPaise: finalPaise,
      currency: "INR",
      status: amountDuePaise > 0 ? "PENDING" : "SUCCESS",
      providerResponse: createResult.success ? paymentLink : createResult.details || null,
      paymentLinkUrl: razorpayShortUrl || null,
      receipt: razorpayOrder?.receipt || `rcpt_${Date.now()}`,
      address: {
        fullName: address?.fullName || "",
        line1: address?.line1 || "",
        city: address?.city || "",
        state: address?.state || "",
        pincode: address?.pincode || "",
      },
      mobile: address?.mobile || "",
      depositPercent: depositPercent ?? auction.depositPercent ?? null,
      depositPaise: appliedDepositPaise,
      depositAmountPaise: depositAmountPaise ?? auction.depositAmountPaise ?? null,
      amountDuePaise,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Defensive update if link created after initial save
    if (createResult.success && razorpayShortUrl && (!paymentDoc.paymentLinkUrl || !paymentDoc.paymentRef)) {
      paymentDoc.paymentLinkUrl = razorpayShortUrl;
      paymentDoc.paymentRef = paymentLinkId || paymentDoc.paymentRef;
      paymentDoc.providerResponse = paymentLink;
      await paymentDoc.save();
    }

    // Build frontend checkout URL (prefer link; fallback to order id)
    let frontendCheckoutUrl = null;
    if (razorpayShortUrl) {
      frontendCheckoutUrl = buildFrontendCheckoutUrl({
        razorpayOrderId: razorpayOrder?.id || "",
        paymentLinkId: paymentLinkId || "",
        auctionId,
        productName: productName || auction.productName || "",
        amountPaise: amountDuePaise > 0 ? amountDuePaise : finalPaise,
      });
    } else if (razorpayOrder?.id) {
      frontendCheckoutUrl = buildFrontendCheckoutUrl({
        razorpayOrderId: razorpayOrder.id,
        paymentLinkId: "",
        auctionId,
        productName: productName || auction.productName || "",
        amountPaise: amountDuePaise > 0 ? amountDuePaise : finalPaise,
      });
    }

    // logs for debugging
    console.log("========================================");
    console.log("PaymentRecord saved id:", paymentDoc._id?.toString());
    console.log("order_id (record):", paymentDoc.order_id);
    console.log("razorpayOrderId:", razorpayOrder?.id || null);
    console.log("razorpayShortUrl:", razorpayShortUrl);
    console.log("frontendCheckoutUrl:", frontendCheckoutUrl);
    console.log("providerResponse saved:", !!paymentDoc.providerResponse);
    console.log("========================================");

    return {
      success: true,
      paymentLinkMissing: !createResult.success,
      razorpayUrl: razorpayShortUrl || null,
      frontendCheckoutUrl: frontendCheckoutUrl || null,
      paymentRecord: paymentDoc,
      paymentLink: paymentLink || null,
      amountPaise: finalPaise,
      depositPaise: appliedDepositPaise,
      amountDuePaise,
      razorpayOrderId: razorpayOrder?.id || null,
      order_id: paymentDoc.order_id,
      debug: createResult.success ? null : (createResult.details || createResult.error || null),
    };
  } catch (err) {
    console.error("generatePaymentLink ERROR:", err);
    return { success: false, error: err?.message || String(err), details: err?.response?.data || null };
  }
}







/* -------------------------
   verify final payment and finalize
   - marks PaymentRecord PAID and updates Auction
   ------------------------- */
export async function verifyFinalPaymentAndFinalize({ paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature, actorUserId = null }) {
  if (!paymentRecordId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    throw new Error("Missing fields: paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature are required");
  }

  const rec = await PaymentRecord.findById(paymentRecordId);
  if (!rec) throw new Error("Payment record not found");

  const ok = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!ok) throw new Error("Invalid Razorpay signature");

  // update payment record
  rec.razorpayPaymentId = razorpay_payment_id;
  rec.razorpaySignature = razorpay_signature;
  rec.status = "PAID";
  rec.updatedAt = new Date();
  await rec.save();

  // update auction
  const auction = await Auction.findById(rec.auction);
  if (!auction) throw new Error("Auction not found");

  // check deposit (if any)
  const deposit = await Deposit.findOne({ auction: auction._id, user: rec.user, status: "paid" }).lean();
  const depositPaise = deposit ? Number(deposit.amountPaise || 0) : 0;

  // If rec.amountPaise exists use it; otherwise use auction current price
  const recAmountPaise = Number(rec.amountPaise ?? 0);
  if (!auction.finalPricePaise) {
    auction.finalPricePaise = recAmountPaise > 0 ? recAmountPaise + (depositPaise || 0) : auction.finalPricePaise ?? auction.currentPricePaise;
  }
  auction.status = "ended";
  auction.isActive = false;
  auction.finalBuyer = rec.user ?? actorUserId ?? auction.finalBuyer ?? null;
  auction.paidAt = new Date();
  await auction.save();

  // emit socket event if available
  if (global.io && typeof global.io.emit === "function") {
    try {
      global.io.emit("paymentCompleted", {
        auctionId: auction._id.toString(),
        paymentId: rec._id.toString(),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
    } catch (e) {
      console.warn("Socket emit failed:", e);
    }
  }

  return { payment: rec, auction };
}


/* -------------------------
   Controller actions: fetch / verify / finalizeNoPay
   Single endpoint: POST /verify (see router below)
   Body must include { action: "fetch" | "verify" | "finalizeNoPay", ... }
   ------------------------- */

export async function handleFetch(body) {
  const { orderId, auctionId } = body || {};
  let payment = null;

  if (orderId) {
    payment = await PaymentRecord.findOne({ razorpayOrderId: orderId }).lean();
    if (!payment && mongoose.Types.ObjectId.isValid(orderId)) {
      payment = await PaymentRecord.findById(orderId).lean();
    }
  }

  if (!payment && auctionId) {
    payment = await PaymentRecord.findOne({ auction: auctionId }).sort({ createdAt: -1 }).lean();
  }

  if (!payment && auctionId) {
    const auction = await Auction.findById(auctionId).lean();
    if (!auction) return { success: false, message: "Auction not found" };
    const amountPaise = auction.finalPricePaise ?? auction.currentPricePaise ?? (auction.startingPricePaise ?? 0);
    const depositPaise = auction.depositAmountPaise ?? Math.ceil((amountPaise * (auction.depositPercent ?? 25)) / 100);
    return {
      success: true,
      data: {
        razorpayOrderId: null,
        paymentRecordId: null,
        amountPaise,
        productName: auction.productName || "",
        auctionId: auction._id.toString(),
        depositPaise,
        checkoutUrl: null,
      },
    };
  }

  if (!payment) return { success: false, message: "Payment record not found" };

  return {
    success: true,
    data: {
      razorpayOrderId: payment.razorpayOrderId || null,
      paymentRecordId: payment._id,
      amountPaise: payment.amountPaise,
      productName: payment.productName || "",
      auctionId: payment.auction ? payment.auction.toString() : null,
      depositPaise: payment.depositPaise ?? 0,
      checkoutUrl: payment.checkoutUrl || null,
    },
  };
}

export async function handleVerify(body, reqUser = null) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, auctionId, paymentRecordId, address } = body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return { success: false, message: "Missing Razorpay verification fields" };
  }

  try {
    const ok = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!ok) return { success: false, message: "Invalid signature" };

    // find payment record (prefer id)
    let payment = null;
    if (paymentRecordId && mongoose.Types.ObjectId.isValid(paymentRecordId)) {
      payment = await PaymentRecord.findById(paymentRecordId);
    }
    if (!payment) payment = await PaymentRecord.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      // fallback: create payment record
      payment = await PaymentRecord.create({
        user: reqUser?._id || null,
        auction: auctionId || null,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amountPaise: null,
        currency: "INR",
        status: "PAID",
        providerResponse: { id: razorpay_order_id },
        address: address || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      payment.status = "PAID";
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      if (address) payment.address = address;
      payment.updatedAt = new Date();
      await payment.save();
    }

    // finalize auction (best-effort)
    try {
      const aid = payment.auction ? payment.auction : auctionId;
      if (aid) {
        const auction = await Auction.findById(aid);
        if (auction) {
          auction.status = "ended";
          auction.isActive = false;
          auction.finalPricePaise = payment.amountPaise ?? auction.finalPricePaise ?? auction.currentPricePaise;
          auction.finalBuyer = payment.user ?? reqUser?._id ?? auction.highestBidder ?? null;
          auction.paidAt = new Date();
          await auction.save();
        }
      }
    } catch (err) {
      console.error("Error updating auction after verify:", err);
    }

    if (global.io && typeof global.io.emit === "function") {
      try {
        global.io.emit("paymentCompleted", {
          auctionId: payment.auction ? payment.auction.toString() : auctionId,
          paymentId: payment._id.toString(),
          razorpayOrderId: razorpay_order_id,
        });
      } catch (err) {
        console.warn("socket emit failed:", err);
      }
    }

    return { success: true, message: "Payment verified and recorded", data: { paymentId: payment._id } };
  } catch (err) {
    console.error("handleVerify error:", err);
    return { success: false, message: err.message || String(err) };
  }
}

export async function handleFinalizeNoPay(body, reqUser = null) {
  const { auctionId, paymentRecordId, address } = body || {};
  if (!auctionId || !paymentRecordId) return { success: false, message: "Missing auctionId or paymentRecordId" };

  const payment = await PaymentRecord.findById(paymentRecordId);
  if (!payment) return { success: false, message: "Payment record not found" };

  payment.status = "PAID";
  if (address) payment.address = address;
  payment.updatedAt = new Date();
  await payment.save();

  const auction = await Auction.findById(auctionId);
  if (auction) {
    auction.status = "ended";
    auction.isActive = false;
    auction.finalPricePaise = auction.finalPricePaise ?? auction.currentPricePaise ?? auction.startingPricePaise;
    auction.finalBuyer = payment.user ?? reqUser?._id ?? auction.highestBidder ?? null;
    auction.paidAt = new Date();
    await auction.save();
  }

  if (global.io && typeof global.io.emit === "function") {
    try {
      global.io.emit("auctionFinalized", { auctionId, paymentRecordId });
    } catch (err) {
      console.warn("socket emit failed:", err);
    }
  }

  return { success: true, message: "Order finalized (no payment required)" };
}
