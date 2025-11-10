import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * ================================
 * 📧 NODEMAILER TRANSPORT CONFIG
 * ================================
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == 465, // true if 465
  auth: {
    user: process.env.EMAIL_USER, // never hardcode!
    pass: process.env.EMAIL_PASS, // Gmail App Password or SMTP token
  },
});

/**
 * Verify transporter connection on startup
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:", error);
  } else {
    console.log("✅ SMTP Server Ready to Send Emails");
  }
});

/**
 * ================================
 * 🏆 AUCTION WIN EMAIL
 * ================================
 */
export const sendAuctionWinEmail = async (
  userEmail,
  userName,
  productName,
  winningBid,
  paymentLink
) => {
  try {
    const mailOptions = {
      from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🎉 You Won the Auction - ${productName}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
          <h2 style="color:#28a745;">Congratulations ${userName}!</h2>
          <p>You have won <strong>${productName}</strong> for <strong>₹${Number(
        winningBid
      ).toLocaleString()}</strong>.</p>
          <p>Click below to complete your payment:</p>
          <a href="${paymentLink}"
            style="display:inline-block;padding:12px 25px;background:#28a745;color:#fff;border-radius:5px;text-decoration:none;font-weight:bold;">
            💳 Pay Now
          </a>
          <p style="margin-top:15px;">Please complete your payment within <b>24 hours</b> to confirm your order.</p>
          <hr/>
          <p style="font-size:12px;color:#888;">If you have any issue, contact us at support@auctionplatform.com</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Winner email sent to ${userEmail}`);
  } catch (err) {
    console.error("❌ Error sending winner email:", err.message);
  }
};

/**
 * ================================
 * ⏰ PAYMENT REMINDER EMAIL
 * ================================
 */
export const sendPaymentReminderEmail = async (
  userEmail,
  userName,
  productName,
  winningBid,
  paymentLink
) => {
  try {
    const mailOptions = {
      from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `⏰ Payment Reminder - ${productName}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
          <h3>Hello ${userName},</h3>
          <p>This is a gentle reminder to complete your payment for 
          <strong>${productName}</strong> worth 
          <strong>₹${Number(winningBid).toLocaleString()}</strong>.</p>
          <p>Click below to finalize your purchase:</p>
          <a href="${paymentLink}"
            style="display:inline-block;padding:12px 25px;background:#ff9800;color:#fff;border-radius:5px;text-decoration:none;font-weight:bold;">
            ⚡ Complete Payment
          </a>
          <p style="margin-top:15px;">Thank you for participating in the auction!</p>
          <hr/>
          <p style="font-size:12px;color:#888;">If you already paid, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Payment reminder email sent to ${userEmail}`);
  } catch (err) {
    console.error("❌ Error sending reminder email:", err.message);
  }
};
