async function sendEmail({ to, toName, subject, htmlContent }) {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Email sent successfully");
    return data;
  } catch (error) {
    console.error("❌ Brevo Email Error:", error.message);
  }
}

module.exports = { sendEmail };