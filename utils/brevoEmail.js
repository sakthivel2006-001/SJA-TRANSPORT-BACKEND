const axios = require("axios");

async function sendEmail({ to, toName, subject, htmlContent }) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "SJA TRANSPORT",
          email: "sattransportofficial@gmail.com",
        },
        to: [
          {
            email: to,
            name: toName || "",
          },
        ],
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = { sendEmail };