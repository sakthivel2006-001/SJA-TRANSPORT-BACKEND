const brevo = require('@getbrevo/brevo');

// Initialize Brevo SDK
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

/**
 * Reusable helper to send emails via Brevo API
 *
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.toName - Recipient name
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - HTML content of the email
 */
const sendEmail = async ({ to, toName, subject, htmlContent }) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = {
    name: "SJA TRANSPORT",
    email: "sattransportofficial@gmail.com",
  };
  
  // Brevo expects an array of recipient objects
  sendSmtpEmail.to = [
    {
      email: to,
      name: toName || to, // fallback to email if name is not provided
    },
  ];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email failed", error?.response?.text || error?.message || error);
    // Note: Do NOT throw the error, we want the calling request to proceed successfully
    // even if the email notification fails.
  }
};

module.exports = { sendEmail };
