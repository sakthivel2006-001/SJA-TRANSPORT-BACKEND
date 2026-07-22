const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendEmail({
  to,
  toName,
  subject,
  htmlContent,
}) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "SJA TRANSPORT",
      email: "sattransportofficial@gmail.com",
    };

    sendSmtpEmail.to = [
      {
        email: to,
        name: toName || "",
      },
    ];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.body || error.message
    );
  }
}

module.exports = { sendEmail };