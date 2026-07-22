const nodemailer = require("nodemailer");

/**
 * Sends a notification directly to the owner/admin via Gmail SMTP.
 * Used as a fallback or primary route when third-party APIs (like Brevo)
 * are blocked by Gmail's sender trust policies.
 */
async function sendOwnerNotification({ subject, htmlContent }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"SJA TRANSPORT" <${process.env.GMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Gmail Owner Notification sent successfully");
  } catch (error) {
    console.error("❌ Gmail Notification Error:", error.message);
  }
}

module.exports = { sendOwnerNotification };
