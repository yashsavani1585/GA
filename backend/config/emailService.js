// // server/services/mailer.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// /* ============================
//    SMTP / TRANSPORT CONFIG
//    ============================ */
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: Number(process.env.SMTP_PORT) || 587,
//   secure: Number(process.env.SMTP_PORT) === 465, // true if 465
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail app password or SMTP password
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ SMTP Connection Failed:", error);
//   } else {
//     console.log("✅ SMTP Server Ready to Send Emails");
//   }
// });

// /* ============================
//    Amount formatting helpers
//    ============================ */

// /**
//  * Given a number which may be in paise (e.g. 1090000) or rupees (10900),
//  * produce formatted rupee string like "10,900.00".
//  *
//  * Heuristic:
//  * - If value >= 100000 treat as paise (>= ₹1,000).
//  * - If value looks like integer and <= 100000 (e.g. 10900) treat as rupees.
//  *
//  * You can still pass a boolean "isPaise" to force interpretation.
//  */
// export function formatRupeesFromPaiseOrRupees(value, { isPaise = undefined } = {}) {
//   if (value == null || isNaN(Number(value))) return "0.00";
//   const n = Number(value);

//   // If caller forced interpretation
//   if (typeof isPaise === "boolean") {
//     const rupees = isPaise ? n / 100 : n;
//     return rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   }

//   // heuristic auto-detect
//   // if it's whole number and >= 100000 => likely paise
//   if (Math.abs(n) >= 100000) {
//     const rupees = n / 100;
//     return rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   }
//   // else treat as rupees
//   return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// }

// export function rupeeNumberFromPaiseOrRupees(value, { isPaise } = {}) {
//   if (value == null || isNaN(Number(value))) return 0;
//   const n = Number(value);
//   if (typeof isPaise === "boolean") return isPaise ? n / 100 : n;
//   if (Math.abs(n) >= 100000) return n / 100;
//   return n;
// }

// /* ============================
//    Email HTML builders
//    ============================ */

// function depositDescription(depositPaise, depositPercent) {
//   if (depositPercent != null) {
//     return `${depositPercent}% (₹${formatRupeesFromPaiseOrRupees(depositPaise, { isPaise: true })})`;
//   }
//   if (depositPaise != null) {
//     return `₹${formatRupeesFromPaiseOrRupees(depositPaise, { isPaise: true })} (fixed)`;
//   }
//   return `₹0.00`;
// }

// function buildWinHtml({ userName, productName, finalPaise, depositPaise, depositPercent, amountDuePaise, frontendCheckoutUrl }) {
//   const finalR = formatRupeesFromPaiseOrRupees(finalPaise, { isPaise: true });
//   const depositR = formatRupeesFromPaiseOrRupees(depositPaise, { isPaise: true });
//   const dueR = formatRupeesFromPaiseOrRupees(amountDuePaise, { isPaise: true });

//   const depositLine = depositPercent != null ? `${depositPercent}% (${depositR})` : `${depositR} (fixed)`;

//   return `
//   <div style="font-family:Arial,Helvetica,sans-serif;max-width:700px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
//     <h2 style="color:#0f5132;margin:0 0 8px;">🎉 Congratulations ${userName}!</h2>
//     <p style="margin:6px 0;">You won the auction for <strong>${productName}</strong>.</p>
//     <table style="width:100%;border-collapse:collapse;margin-top:12px;">
//       <tr><td style="padding:6px 0;"><strong>Final price:</strong></td><td style="padding:6px 0;text-align:right;">₹${finalR}</td></tr>
//       <tr><td style="padding:6px 0;"><strong>Deposit applied:</strong></td><td style="padding:6px 0;text-align:right;">${depositLine}</td></tr>
//       <tr style="border-top:1px solid #eee;"><td style="padding:10px 0;"><strong>Amount to pay now:</strong></td><td style="padding:10px 0;text-align:right;font-weight:700;">₹${dueR}</td></tr>
//     </table>

//     <div style="text-align:center;margin:20px 0;">
//       ${
//         amountDuePaise > 0 && frontendCheckoutUrl
//           ? `<a href="${frontendCheckoutUrl}" style="display:inline-block;padding:12px 20px;background:#198754;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">💳 Pay ₹${dueR} now</a>`
//           : `<div style="padding:12px;background:#f1f1f1;border-radius:6px;display:inline-block;">${amountDuePaise > 0 ? "Payment link not available" : "Deposit covers full amount — no further payment required."}</div>`
//       }
//     </div>

//     <p style="font-size:13px;color:#666;margin-top:8px;">If you have any questions, reply to this email or contact support at <a href="mailto:${process.env.SUPPORT_EMAIL || "support@yourdomain.com"}">${process.env.SUPPORT_EMAIL || "support@yourdomain.com"}</a>.</p>
//   </div>
//   `;
// }

// function buildReminderHtml({ userName, productName, finalPaise, depositPaise, depositPercent, amountDuePaise, frontendCheckoutUrl }) {
//   const finalR = formatRupeesFromPaiseOrRupees(finalPaise, { isPaise: true });
//   const depositR = formatRupeesFromPaiseOrRupees(depositPaise, { isPaise: true });
//   const dueR = formatRupeesFromPaiseOrRupees(amountDuePaise, { isPaise: true });
//   const depositLine = depositPercent != null ? `${depositPercent}% (${depositR})` : `${depositR} (fixed)`;

//   return `
//   <div style="font-family:Arial,Helvetica,sans-serif;max-width:700px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
//     <h3 style="margin:0 0 8px;color:#6f5132;">⏰ Payment Reminder</h3>
//     <p style="margin:6px 0;">Hi ${userName},</p>
//     <p style="margin:6px 0;">This is a reminder to complete your payment for <strong>${productName}</strong>.</p>

//     <table style="width:100%;border-collapse:collapse;margin-top:12px;">
//       <tr><td style="padding:6px 0;"><strong>Final price:</strong></td><td style="padding:6px 0;text-align:right;">₹${finalR}</td></tr>
//       <tr><td style="padding:6px 0;"><strong>Deposit applied:</strong></td><td style="padding:6px 0;text-align:right;">${depositLine}</td></tr>
//       <tr style="border-top:1px solid #eee;"><td style="padding:10px 0;"><strong>Amount due:</strong></td><td style="padding:10px 0;text-align:right;font-weight:700;">₹${dueR}</td></tr>
//     </table>

//     <div style="text-align:center;margin:18px 0;">
//       ${
//         amountDuePaise > 0 && frontendCheckoutUrl
//           ? `<a href="${frontendCheckoutUrl}" style="display:inline-block;padding:12px 20px;background:#ff9800;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">⚡ Complete Payment (₹${dueR})</a>`
//           : `<div style="padding:12px;background:#f1f1f1;border-radius:6px;display:inline-block;">${amountDuePaise > 0 ? "Payment link not available" : "Deposit covers full amount — no payment due."}</div>`
//       }
//     </div>

//     <p style="font-size:13px;color:#666;margin-top:8px;">If you've already paid, please ignore this message.</p>
//   </div>
//   `;
// }

// /* ============================
//    Exported email functions
//    ============================ */

// /**
//  * sendAuctionWinEmail
//  * - finalPaise, depositPaise, amountDuePaise should be in paise
//  */
// export const sendAuctionWinEmail = async (
//   userEmail,
//   userName,
//   productName,
//   finalPaise = 0,
//   depositPaise = 0,
//   depositPercent = null,
//   amountDuePaise = null,
//   frontendCheckoutUrl = null
// ) => {
//   try {
//     // normalize amountDue
//     const due = amountDuePaise == null ? Math.max(0, Number(finalPaise) - Number(depositPaise || 0)) : Number(amountDuePaise);

//     const subject = `🎉 You Won the Auction — ${productName}`;
//     const html = buildWinHtml({
//       userName: userName || "Customer",
//       productName: productName || "Product",
//       finalPaise: Number(finalPaise || 0),
//       depositPaise: Number(depositPaise || 0),
//       depositPercent: depositPercent,
//       amountDuePaise: due,
//       frontendCheckoutUrl,
//     });

//     const text = `Hi ${userName || "Customer"}\n\nYou won ${productName} for ₹${formatRupeesFromPaiseOrRupees(finalPaise, { isPaise: true })}.\nDeposit: ${depositDescription(depositPaise, depositPercent)}.\nAmount to pay now: ₹${formatRupeesFromPaiseOrRupees(due, { isPaise: true })}.\nPay here: ${frontendCheckoutUrl || "N/A"}\n\nThanks.`;

//     await transporter.sendMail({
//       from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject,
//       html,
//       text,
//     });

//     console.log(`✅ Winner email sent to ${userEmail} — final ₹${formatRupeesFromPaiseOrRupees(finalPaise, { isPaise: true })}, deposit ₹${formatRupeesFromPaiseOrRupees(depositPaise, { isPaise: true })}, due ₹${formatRupeesFromPaiseOrRupees(due, { isPaise: true })}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Error sending winner email:", err && (err.message || err));
//     return { success: false, error: err && (err.message || String(err)) };
//   }
// };

// /**
//  * sendPaymentReminderEmail
//  * - finalPaise, depositPaise, amountDuePaise should be in paise
//  */
// export const sendPaymentReminderEmail = async (
//   userEmail,
//   userName,
//   productName,
//   finalPaise = 0,
//   depositPaise = 0,
//   depositPercent = null,
//   amountDuePaise = null,
//   frontendCheckoutUrl = null
// ) => {
//   try {
//     const due = amountDuePaise == null ? Math.max(0, Number(finalPaise) - Number(depositPaise || 0)) : Number(amountDuePaise);

//     const subject = `⏰ Payment Reminder - ${productName}`;
//     const html = buildReminderHtml({
//       userName: userName || "Customer",
//       productName: productName || "Product",
//       finalPaise: Number(finalPaise || 0),
//       depositPaise: Number(depositPaise || 0),
//       depositPercent,
//       amountDuePaise: due,
//       frontendCheckoutUrl,
//     });

//     const text = `Hi ${userName || "Customer"}\n\nReminder: please pay ₹${formatRupeesFromPaiseOrRupees(due, { isPaise: true })} for ${productName}.\nPay here: ${frontendCheckoutUrl || "N/A"}\n\nThanks.`;

//     await transporter.sendMail({
//       from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject,
//       html,
//       text,
//     });

//     console.log(`✅ Reminder email sent to ${userEmail} — due ₹${formatRupeesFromPaiseOrRupees(due, { isPaise: true })}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Error sending reminder email:", err && (err.message || err));
//     return { success: false, error: err && (err.message || String(err)) };
//   }
// };

// server/services/mailerWithLinks.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import PaymentRecord from "../models/PaymentRecord.js"; // adjust path
import Auction from "../models/auctionModel.js"; // optional (if you use it to read productName)

dotenv.config();

/* ----------------------------------
   Config / Instances
   ---------------------------------- */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@yourdomain.com";

/* SMTP transporter */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 0) === 465,
  auth:
    process.env.EMAIL_USER && process.env.EMAIL_PASS
      ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      : undefined,
  tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
  connectionTimeout: 10_000,
});

transporter.verify((err) => {
  if (err) console.error("❌ SMTP verify failed:", err && (err.message || err));
  else console.log("✅ SMTP transporter ready");
});

/* Razorpay */
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

/* ----------------------------------
   Helpers
   ---------------------------------- */

/** Format rupees from paise (paise numeric -> "1,234.00") */
export function formatRupeesFromPaise(paise) {
  if (paise == null || isNaN(Number(paise))) return "0.00";
  const rupees = Number(paise) / 100;
  return rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Build frontend checkout url for email or app redirect */
export function buildFrontendCheckoutUrl({
  razorpayOrderId = "",
  paymentLinkId = "",
  auctionId = "",
  productName = "",
  amountPaise = 0,
}) {
  const params = new URLSearchParams();
  if (razorpayOrderId) params.set("order_id", razorpayOrderId);
  if (paymentLinkId) params.set("paymentLink", paymentLinkId);
  if (auctionId) params.set("auction", auctionId);
  if (productName) params.set("product", productName);
  if (typeof amountPaise !== "undefined") params.set("amount", String(amountPaise));
  return `${FRONTEND_URL}/checkout?${params.toString()}`;
}

/**
 * Create Razorpay hosted payment link and save short_url to PaymentRecord.
 * Returns { success, paymentLink, paymentLinkUrl, paymentRecord, error }
 */
export async function createAndSavePaymentLink({ paymentRecordId, amountPaise, description = "Auction payment", customer = {}, notes = {} }) {
  try {
    if (!paymentRecordId) return { success: false, error: "paymentRecordId required" };
    if (!amountPaise || Number(amountPaise) <= 0) return { success: false, error: "Invalid amountPaise" };

    // Build payload
    const payload = {
      amount: Number(amountPaise),
      currency: "INR",
      accept_partial: false,
      description,
      reference_id: `rcpt_${Date.now()}`,
      notes,
    };

    const customerObj = {};
    if (customer.name) customerObj.name = customer.name;
    if (customer.contact) customerObj.contact = String(customer.contact);
    if (customer.email) customerObj.email = String(customer.email);
    if (Object.keys(customerObj).length > 0) payload.customer = customerObj;

    // Create hosted payment link in Razorpay
    const paymentLink = await razorpayInstance.paymentLink.create(payload);
    const short = paymentLink?.short_url || paymentLink?.long_url || (paymentLink?.data && paymentLink.data.short_url) || null;

    // Save to PaymentRecord
    const pr = await PaymentRecord.findById(paymentRecordId);
    if (!pr) return { success: false, error: "PaymentRecord not found" };

    pr.providerResponse = paymentLink;
    pr.paymentLinkUrl = short || pr.paymentLinkUrl || null;
    pr.paymentRef = pr.paymentRef || paymentLink?.id || pr.paymentRef || null;
    pr.updatedAt = new Date();
    await pr.save();

    return { success: true, paymentLink, paymentLinkUrl: pr.paymentLinkUrl, paymentRecord: pr };
  } catch (err) {
    console.error("createAndSavePaymentLink ERROR:", err?.error || err?.response?.data || err?.message || err);
    const details = err?.error || err?.response?.data || err?.message || String(err);
    return { success: false, error: details };
  }
}

/**
 * Ensure PaymentRecord has a hosted link (if amount due > 0). Returns { success, paymentLinkUrl, paymentRecord, error }
 */
export async function ensurePaymentLinkForRecord(paymentRecord) {
  try {
    if (!paymentRecord) return { success: false, error: "Missing paymentRecord" };

    // prefer saved short url
    let paymentLinkUrl =
      paymentRecord.paymentLinkUrl ||
      (paymentRecord.providerResponse && (paymentRecord.providerResponse.short_url || paymentRecord.providerResponse.data?.short_url)) ||
      null;

    const finalPaise = Number(paymentRecord.amountPaise || 0);
    const depositPaise = Number(paymentRecord.depositPaise || 0);
    const amountDuePaise = Number(paymentRecord.amountDuePaise ?? Math.max(0, finalPaise - depositPaise));

    if (amountDuePaise > 0 && !paymentLinkUrl) {
      // create hosted link
      const customer = {
        name: paymentRecord.address?.fullName || "",
        contact: paymentRecord.mobile || "",
        email: paymentRecord.email || "",
      };
      const notes = { paymentRecordId: String(paymentRecord._id), auctionId: String(paymentRecord.auction || "") };

      const created = await createAndSavePaymentLink({
        paymentRecordId: String(paymentRecord._id),
        amountPaise: amountDuePaise,
        description: (paymentRecord.items && paymentRecord.items[0] && paymentRecord.items[0].name) || "Auction payment",
        customer,
        notes,
      });

      if (created.success) {
        return { success: true, paymentLinkUrl: created.paymentLinkUrl || null, paymentRecord: created.paymentRecord };
      } else {
        // creation failed, return failure but include any url if present
        return { success: false, error: created.error || "create link failed", paymentLinkUrl: null, paymentRecord };
      }
    }

    // link already exists or no amount due
    return { success: true, paymentLinkUrl, paymentRecord };
  } catch (err) {
    console.error("ensurePaymentLinkForRecord ERROR:", err);
    return { success: false, error: err && (err.message || String(err)) };
  }
}

/* ----------------------------------
   Email HTML builders
   ---------------------------------- */

function depositDescription(depositPaise, depositPercent) {
  if (depositPercent != null) {
    return `${depositPercent}% (₹${formatRupeesFromPaise(depositPaise)})`;
  }
  if (depositPaise != null) {
    return `₹${formatRupeesFromPaise(depositPaise)} (fixed)`;
  }
  return `₹0.00`;
}

function buildWinHtml({ userName, productName, finalPaise, depositPaise, depositPercent, amountDuePaise, frontendCheckoutUrl }) {
  const finalR = formatRupeesFromPaise(finalPaise);
  const depositR = formatRupeesFromPaise(depositPaise);
  const dueR = formatRupeesFromPaise(amountDuePaise);

  const depositLine = depositPercent != null ? `${depositPercent}% (${depositR})` : `${depositR} (fixed)`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:700px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
    <h2 style="color:#0f5132;margin:0 0 8px;">🎉 Congratulations ${userName}!</h2>
    <p style="margin:6px 0;">You won the auction for <strong>${productName}</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <tr><td style="padding:6px 0;"><strong>Final price:</strong></td><td style="padding:6px 0;text-align:right;">₹${finalR}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Deposit applied:</strong></td><td style="padding:6px 0;text-align:right;">${depositLine}</td></tr>
      <tr style="border-top:1px solid #eee;"><td style="padding:10px 0;"><strong>Amount to pay now:</strong></td><td style="padding:10px 0;text-align:right;font-weight:700;">₹${dueR}</td></tr>
    </table>

    <div style="text-align:center;margin:20px 0;">
      ${
        amountDuePaise > 0 && frontendCheckoutUrl
          ? `<a href="${frontendCheckoutUrl}" style="display:inline-block;padding:12px 20px;background:#198754;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">💳 Pay ₹${dueR} now</a>`
          : `<div style="padding:12px;background:#f1f1f1;border-radius:6px;display:inline-block;">${amountDuePaise > 0 ? "Payment link not available" : "Deposit covers full amount — no further payment required."}</div>`
      }
    </div>

    <p style="font-size:13px;color:#666;margin-top:8px;">If you have any questions, reply to this email or contact support at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
  </div>
  `;
}

function buildReminderHtml({ userName, productName, finalPaise, depositPaise, depositPercent, amountDuePaise, frontendCheckoutUrl }) {
  const finalR = formatRupeesFromPaise(finalPaise);
  const depositR = formatRupeesFromPaise(depositPaise);
  const dueR = formatRupeesFromPaise(amountDuePaise);
  const depositLine = depositPercent != null ? `${depositPercent}% (${depositR})` : `${depositR} (fixed)`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:700px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
    <h3 style="margin:0 0 8px;color:#6f5132;">⏰ Payment Reminder</h3>
    <p style="margin:6px 0;">Hi ${userName},</p>
    <p style="margin:6px 0;">This is a reminder to complete your payment for <strong>${productName}</strong>.</p>

    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <tr><td style="padding:6px 0;"><strong>Final price:</strong></td><td style="padding:6px 0;text-align:right;">₹${finalR}</td></tr>
      <tr><td style="padding:6px 0;"><strong>Deposit applied:</strong></td><td style="padding:6px 0;text-align:right;">${depositLine}</td></tr>
      <tr style="border-top:1px solid #eee;"><td style="padding:10px 0;"><strong>Amount due:</strong></td><td style="padding:10px 0;text-align:right;font-weight:700;">₹${dueR}</td></tr>
    </table>

    <div style="text-align:center;margin:18px 0;">
      ${
        amountDuePaise > 0 && frontendCheckoutUrl
          ? `<a href="${frontendCheckoutUrl}" style="display:inline-block;padding:12px 20px;background:#ff9800;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">⚡ Complete Payment (₹${dueR})</a>`
          : `<div style="padding:12px;background:#f1f1f1;border-radius:6px;display:inline-block;">${amountDuePaise > 0 ? "Payment link not available" : "Deposit covers full amount — no payment due."}</div>`
      }
    </div>

    <p style="font-size:13px;color:#666;margin-top:8px;">If you've already paid, please ignore this message.</p>
  </div>
  `;
}

export function secondBidderHtml({
  userName,
  productName,
  amountDuePaise,
  frontendCheckoutUrl,
}) {
  return `
  <div style="font-family:Arial;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;">
    <h2 style="color:#0d6efd;">🔁 Second Chance to Win!</h2>

    <p>Hello <b>${userName}</b>,</p>

    <p>The original winner did not complete payment within 48 hours.</p>

    <p>You are now eligible to purchase:</p>
    <h3>${productName}</h3>

    <p><b>Amount to Pay:</b> ₹${formatRupeesFromPaise(amountDuePaise)}</p>

    <a href="${frontendCheckoutUrl}"
      style="display:inline-block;margin-top:16px;padding:12px 20px;
             background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;">
      Complete Payment
    </a>

    <p style="margin-top:20px;color:#666;font-size:13px;">
      ⏳ This link is active for a limited time.  
      Payment is securely handled by Razorpay.
    </p>
  </div>
  `;
}



export function lostAuctionRefundHtml({
  userName = "Customer",
  productName = "Product",
  depositPaise = 0,
}) {
  const refundAmount = (depositPaise / 100).toFixed(2);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Auction Result – Refund Initiated</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
    <tr>
      <td align="center">

        <!-- MAIN CONTAINER -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:#0f172a;padding:20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">
                Auction Platform
              </h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px;color:#1f2937;">

              <p style="font-size:16px;margin-top:0;">
                Hello <strong>${userName}</strong>,
              </p>

              <p style="font-size:15px;line-height:1.6;">
                Thank you for participating in the auction for
                <strong>${productName}</strong>.
              </p>

              <p style="font-size:15px;line-height:1.6;">
                Unfortunately, you did not win this auction.  
                However, we truly appreciate your interest and participation.
              </p>

              <!-- REFUND BOX -->
              <div style="margin:25px 0;padding:18px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
                <p style="margin:0;font-size:15px;">
                  💰 <strong>Deposit Refund Initiated</strong>
                </p>
                // <p style="margin:8px 0 0;font-size:14px;">
                //   Refund Amount:
                //   <strong>₹${refundAmount}</strong>
                // </p>
                <p style="margin:6px 0 0;font-size:13px;color:#374151;">
                  Your deposit will be automatically refunded within
                  <strong>24 hours</strong> to the same
                  <strong>UPI ID / bank account</strong>
                  used during payment.
                </p>
              </div>

              <p style="font-size:14px;line-height:1.6;">
                Refunds are securely processed via
                <strong>Razorpay</strong>.  
                No action is required from your side.
              </p>

              <p style="font-size:14px;line-height:1.6;">
                We look forward to seeing you in upcoming auctions.
              </p>

              <p style="font-size:15px;margin-bottom:0;">
                Warm regards,<br />
                <strong>Auction Platform Team</strong>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb;padding:15px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;">
                © ${new Date().getFullYear()} Auction Platform. All rights reserved.
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#6b7280;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- END CONTAINER -->

      </td>
    </tr>
  </table>

</body>
</html>
`;
}



/* ----------------------------------
   Exports: sendAuctionWinEmail & reminder
   ---------------------------------- */

/**
 * sendAuctionWinEmail
 * - finalPaise, depositPaise, amountDuePaise should be in paise
 * - frontendCheckoutUrl: if provided, used as payment button href
 */
export async function sendAuctionWinEmail(
  userEmail,
  userName,
  productName,
  finalPaise = 0,
  depositPaise = 0,
  depositPercent = null,
  amountDuePaise = null,
  frontendCheckoutUrl = null
) {
  try {
    const due = amountDuePaise == null ? Math.max(0, Number(finalPaise) - Number(depositPaise || 0)) : Number(amountDuePaise);

    const subject = `🎉 You won the auction — ${productName}`;
    const html = buildWinHtml({
      userName: userName || "Customer",
      productName: productName || "Product",
      finalPaise: Number(finalPaise || 0),
      depositPaise: Number(depositPaise || 0),
      depositPercent,
      amountDuePaise: due,
      frontendCheckoutUrl,
    });

    const text = `Hi ${userName || "Customer"}\n\nYou won ${productName} for ₹${formatRupeesFromPaise(finalPaise)}.\nDeposit applied: ${depositDescription(depositPaise, depositPercent)}.\nAmount to pay now: ₹${formatRupeesFromPaise(due)}.\nPay here: ${frontendCheckoutUrl || "N/A"}\n\nThanks.`;

    const info = await transporter.sendMail({
      from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html,
      text,
    });

    console.log(`✅ Winner email sent to ${userEmail} (msgId=${info.messageId})`);
    return { success: true, info };
  } catch (err) {
    console.error("❌ Error sending winner email:", err && (err.message || err));
    return { success: false, error: err && (err.message || String(err)) };
  }
}

export async function sendSecondBidderEmail({
  userEmail,
  userName,
  productName,
  finalPaise = 0,
  depositPaise = 0,
  depositPercent = null,
  amountDuePaise = null,
  frontendCheckoutUrl = null,
}) {
  try {
    if (!userEmail) {
      throw new Error("Recipient email missing");
    }

    const finalAmount = Number(finalPaise) || 0;
    const depositAmount = Number(depositPaise) || 0;

    const duePaise =
      amountDuePaise != null
        ? Number(amountDuePaise)
        : Math.max(0, finalAmount - depositAmount);

    const info = await transporter.sendMail({
      from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Second Chance – Complete Payment",
      html: secondBidderHtml({
        userName: userName || "Customer",
        productName: productName || "Product",
        finalPaise: finalAmount,
        depositPaise: depositAmount,
        depositPercent,
        amountDuePaise: duePaise,
        frontendCheckoutUrl: frontendCheckoutUrl || "#",
      }),
      text: `Hi ${userName || "Customer"},

You now have a second chance to purchase ${productName || "the product"}.

Amount to pay: ₹${formatRupeesFromPaise(duePaise)}

Pay here: ${frontendCheckoutUrl || "N/A"}
`,
    });

    console.log(
      `✅ Second bidder email sent to ${userEmail} (msgId=${info.messageId})`
    );
    return { success: true, info };
  } catch (err) {
    console.error("❌ sendSecondBidderEmail error:", err.message);
    return { success: false, error: err.message };
  }
}



export async function sendAuctionLostRefundEmail({
  userEmail,
  userName,
  productName,
  depositPaise = 0,
}) {
  try {
    if (!userEmail) {
      throw new Error("Recipient email missing");
    }

    const info = await transporter.sendMail({
      from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Auction Result – Deposit Refund Initiated",
      html: lostAuctionRefundHtml({
        userName,
        productName,
        depositAmount: depositPaise,
      }),
      text: `Hi ${userName || "Customer"},

Thank you for participating in the auction for ${productName || "the product"}.

Unfortunately, you did not win this auction.
Your deposit of ₹${(depositPaise / 100).toFixed(
        2
      )} has been initiated and will be refunded within 24 hours.

Regards,
Auction Platform Team`,
    });

    console.log(
      `✅ Lost bidder refund email sent to ${userEmail} (msgId=${info.messageId})`
    );

    return { success: true, info };
  } catch (err) {
    console.error("❌ sendAuctionLostRefundEmail error:", err.message);
    return { success: false, error: err.message };
  }
}



export async function sendPaymentReminderEmail({ paymentRecordId = null, userEmail = null, userName = null, productName = null, finalPaise = 0, depositPaise = 0, depositPercent = null, amountDuePaise = null }) {
  try {
    let pr = null;
    if (paymentRecordId) {
      pr = await PaymentRecord.findById(paymentRecordId).lean();
      if (!pr) return { success: false, error: "PaymentRecord not found" };
    }

    // if paymentRecord found, ensure link
    let frontendCheckoutUrl = null;
    if (pr) {
      const ensure = await ensurePaymentLinkForRecord(pr);
      const link = ensure.paymentLinkUrl || null;

      frontendCheckoutUrl = link || buildFrontendCheckoutUrl({
        razorpayOrderId: pr.razorpayOrderId || "",
        paymentLinkId: pr.paymentRef || "",
        auctionId: String(pr.auction || ""),
        productName: pr.items && pr.items[0] && pr.items[0].name ? String(pr.items[0].name) : "",
        amountPaise: pr.amountDuePaise ?? pr.amountPaise ?? 0,
      });

      userEmail = userEmail || pr.email || pr.userEmail || (pr.user && pr.user.email) || null;
      userName = userName || pr.address?.fullName || "Customer";
      productName = productName || (pr.items && pr.items[0] && pr.items[0].name) || "Product";
      finalPaise = finalPaise || pr.amountPaise || 0;
      depositPaise = depositPaise || pr.depositPaise || 0;
      depositPercent = depositPercent ?? pr.depositPercent ?? null;
      amountDuePaise = amountDuePaise == null ? (pr.amountDuePaise ?? Math.max(0, finalPaise - depositPaise)) : amountDuePaise;
    } else {
      // fallback to passed values (legacy)
      frontendCheckoutUrl = buildFrontendCheckoutUrl({ amountPaise: amountDuePaise ?? finalPaise, productName: productName || "" });
    }

    if (!userEmail) return { success: false, error: "No recipient email available" };

    const subject = `⏰ Payment reminder — ${productName}`;
    const html = buildReminderHtml({
      userName,
      productName,
      finalPaise: Number(finalPaise || 0),
      depositPaise: Number(depositPaise || 0),
      depositPercent,
      amountDuePaise: Number(amountDuePaise || 0),
      frontendCheckoutUrl,
    });

    const text = `Hi ${userName}\n\nReminder: please pay ₹${formatRupeesFromPaise(amountDuePaise || 0)} for ${productName}.\nPay here: ${frontendCheckoutUrl || "N/A"}\n\nThanks.`;

    const info = await transporter.sendMail({ from: `"Auction Platform" <${process.env.EMAIL_USER}>`, to: userEmail, subject, html, text });

    console.log(`✅ Reminder email sent to ${userEmail} (msgId=${info.messageId})`);
    return { success: true, info, frontendCheckoutUrl };
  } catch (err) {
    console.error("sendPaymentReminderEmail ERROR:", err);
    return { success: false, error: err && (err.message || String(err)) };
  }
}


export async function ensureLinkAndSendWinEmail(paymentRecordId) {
  try {
    if (!paymentRecordId) return { success: false, error: "paymentRecordId required" };
    const pr = await PaymentRecord.findById(paymentRecordId).lean();
    if (!pr) return { success: false, error: "PaymentRecord not found" };

    // ensure hosted link
    const ensure = await ensurePaymentLinkForRecord(pr);
    const paymentLinkUrl = ensure.paymentLinkUrl || null;

    // frontend checkout url: prefer hosted short url (easy for user)
    const frontendCheckoutUrl = paymentLinkUrl || buildFrontendCheckoutUrl({
      razorpayOrderId: pr.razorpayOrderId || "",
      paymentLinkId: pr.paymentRef || "",
      auctionId: String(pr.auction || ""),
      productName: pr.items && pr.items[0] && pr.items[0].name ? String(pr.items[0].name) : "",
      amountPaise: pr.amountDuePaise ?? pr.amountPaise ?? 0,
    });

    const finalPaise = Number(pr.amountPaise || 0);
    const depositPaise = Number(pr.depositPaise || 0);
    const depositPercent = pr.depositPercent ?? null;
    const amountDuePaise = Number(pr.amountDuePaise ?? Math.max(0, finalPaise - depositPaise));

    const toEmail = pr.email || pr.userEmail || (pr.user && pr.user.email) || null;
    const toName = pr.address?.fullName || "Customer";
    const productName = (pr.items && pr.items[0] && pr.items[0].name) || (pr.productName) || "Product";

    if (!toEmail) {
      console.warn("No recipient email on PaymentRecord", paymentRecordId);
      return { success: false, error: "No recipient email on PaymentRecord" };
    }

    const mailRes = await sendAuctionWinEmail(
      toEmail,
      toName,
      productName,
      finalPaise,
      depositPaise,
      depositPercent,
      amountDuePaise,
      frontendCheckoutUrl
    );

    return { success: !!mailRes.success, mailRes, frontendCheckoutUrl, paymentLinkUrl };
  } catch (err) {
    console.error("ensureLinkAndSendWinEmail ERROR:", err);
    return { success: false, error: err && (err.message || String(err)) };
  }
}

/* quick test helper */
export async function sendTestEmail(targetEmail = process.env.EMAIL_USER) {
  try {
    if (!targetEmail) throw new Error("No test email target provided");
    const info = await transporter.sendMail({
      from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: "[Test] SMTP configuration",
      text: "This is a test message to verify SMTP configuration.",
      html: "<p>This is a test message to verify SMTP configuration.</p>",
    });
    console.log(`✅ Test email sent to ${targetEmail} (msgId=${info.messageId})`);
    return { success: true, info };
  } catch (err) {
    console.error("❌ Test email failed:", err);
    return { success: false, error: err && (err.message || String(err)) };
  }
}

/* Default export (optional) */
export default {
  transporter,
  razorpayInstance,
  sendSecondBidderEmail,
  sendAuctionLostRefundEmail,
  createAndSavePaymentLink,
  ensurePaymentLinkForRecord,
  buildFrontendCheckoutUrl,
  sendAuctionWinEmail,
  ensureLinkAndSendWinEmail,
  sendPaymentReminderEmail,
  sendTestEmail,
};
