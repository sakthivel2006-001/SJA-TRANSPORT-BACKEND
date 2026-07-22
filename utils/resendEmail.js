const { Resend } = require('resend');

let resend;
function getClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function sendOwnerEmail({ subject, htmlContent }) {
  try {
    const result = await getClient().emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.OWNER_EMAIL,
      subject,
      html: htmlContent,
    });
    console.log('✅ Resend: Owner email sent', result);
    return result;
  } catch (error) {
    console.error('❌ Resend Error:', error.message);
  }
}

module.exports = { sendOwnerEmail };
