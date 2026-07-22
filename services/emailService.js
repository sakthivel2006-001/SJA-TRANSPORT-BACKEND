const { sendEmail } = require('../utils/brevoEmail');
const { sendOwnerNotification } = require('../utils/gmailNotify');

/* Booking notification */
const sendBookingNotification = async (booking) => {
  const formattedDate = new Date(booking.pickupDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `New Booking – ${booking.customerName}`;
  const htmlContent = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#f9fafb;border-radius:12px">
        <div style="background:#0F172A;color:#fff;padding:20px 30px;border-radius:8px;text-align:center">
          <h1 style="margin:0;color:#D4AF37;font-size:24px">New Booking Received</h1>
          <p style="margin:4px 0 0;color:#94a3b8;font-size:14px">SJA TRANSPORT • Booking Notification</p>
        </div>

        <div style="background:#fff;padding:24px;border-radius:8px;margin-top:16px;border:1px solid #e5e7eb">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;color:#6b7280;width:40%">Customer Name</td><td style="padding:10px 0;font-weight:600">${booking.customerName}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Phone</td><td style="padding:10px 0;font-weight:600">${booking.phone}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Service Type</td><td style="padding:10px 0;font-weight:600">${booking.serviceType || 'N/A'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Vehicle Type</td><td style="padding:10px 0;font-weight:600">${booking.vehicleType || 'N/A'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Pickup Location</td><td style="padding:10px 0;font-weight:600">${booking.pickupLocation}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Destination State</td><td style="padding:10px 0;font-weight:600">${booking.destinationState || 'N/A'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Delivery Location</td><td style="padding:10px 0;font-weight:600">${booking.deliveryLocation}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Pickup Date</td><td style="padding:10px 0;font-weight:600">${formattedDate}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Goods Description</td><td style="padding:10px 0;font-weight:600">${booking.goodsDescription}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Additional Notes</td><td style="padding:10px 0;font-weight:600">${booking.additionalNotes || 'N/A'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280">Booking Time</td><td style="padding:10px 0;font-weight:600">${new Date(booking.createdAt).toLocaleString('en-IN')}</td></tr>
          </table>
        </div>

        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px">&copy; ${new Date().getFullYear()} SJA TRANSPORT. All rights reserved.</p>
      </div>
    `;

  await sendOwnerNotification({
    subject,
    htmlContent,
  });
};

/* Booking: send confirmation to customer */
const sendBookingConfirmation = async (booking) => {
  const formattedDate = booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString('en-IN') : 'N/A';
  const toEmail = booking.email || booking.customerEmail || booking.customerPhoneOwner || booking.phone;
  const toName = booking.customerName || booking.name || 'Customer';
  const subject = `Booking Received - SJA TRANSPORT`;
  const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff">
        <h2 style="color:#0F172A">Booking Received - SJA TRANSPORT</h2>
        <p>Dear ${toName},</p>
        <p>Thank you for choosing SJA TRANSPORT.</p>
        <p>Your shipment booking has been received successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <tr><td style="padding:6px;color:#6b7280;width:40%">Booking ID</td><td style="padding:6px;font-weight:600">${booking.bookingId || ''}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Customer Name</td><td style="padding:6px;font-weight:600">${booking.customerName}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Phone</td><td style="padding:6px;font-weight:600">${booking.phone}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Pickup Location</td><td style="padding:6px;font-weight:600">${booking.pickupLocation}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Delivery Location</td><td style="padding:6px;font-weight:600">${booking.deliveryLocation}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Vehicle</td><td style="padding:6px;font-weight:600">${booking.vehicleType}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Service Type</td><td style="padding:6px;font-weight:600">${booking.serviceType}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Pickup Date</td><td style="padding:6px;font-weight:600">${formattedDate}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Current Status</td><td style="padding:6px;font-weight:600">${booking.bookingStatus || 'Pending'}</td></tr>
        </table>
        <p style="margin-top:12px">Our team will review your booking shortly.</p>
        <p style="margin-top:12px">Thank you.<br/>SJA TRANSPORT</p>
      </div>
    `;

  await sendEmail({
    to: toEmail,
    toName: toName,
    subject,
    htmlContent,
  });
};

/* Booking: send status update to customer */
const sendBookingStatusUpdate = async (booking) => {
  const status = booking.bookingStatus;
  const subjects = {
    Approved: 'Booking Approved',
    Rejected: 'Booking Rejected',
    'In Progress': 'Shipment In Progress',
    Completed: 'Shipment Delivered',
    Pending: 'Booking Update',
    Cancelled: 'Booking Cancelled',
  };
  const messages = {
    Approved: `Your shipment booking has been approved.`,
    Rejected: `Unfortunately your booking could not be approved. Please contact SJA TRANSPORT for more information.`,
    'In Progress': `Your shipment is currently in transit.`,
    Completed: `Your shipment has been delivered successfully. Thank you for choosing SJA TRANSPORT.`,
    Pending: `Your booking status is now Pending.`,
    Cancelled: `Your booking has been cancelled. Please contact us for details.`,
  };

  const body = messages[status] || `Your booking status changed to ${status}`;
  const toEmail = booking.email || booking.customerEmail || booking.phone;
  const toName = booking.customerName || 'Customer';
  const subject = subjects[status] || `Booking Update - ${status}`;
  const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff">
        <h2 style="color:#0F172A">${subjects[status] || 'Booking Update'}</h2>
        <p>Dear ${toName},</p>
        <p>${body}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <tr><td style="padding:6px;color:#6b7280;width:40%">Booking ID</td><td style="padding:6px;font-weight:600">${booking.bookingId || ''}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Pickup</td><td style="padding:6px;font-weight:600">${booking.pickupLocation}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Delivery</td><td style="padding:6px;font-weight:600">${booking.deliveryLocation}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Vehicle</td><td style="padding:6px;font-weight:600">${booking.vehicleType}</td></tr>
          <tr><td style="padding:6px;color:#6b7280">Service</td><td style="padding:6px;font-weight:600">${booking.serviceType}</td></tr>
        </table>
        <p style="margin-top:12px">Our team will contact you shortly.</p>
        <p style="margin-top:12px">Thank you.<br/>SJA TRANSPORT</p>
      </div>
    `;

  await sendEmail({
    to: toEmail,
    toName: toName,
    subject,
    htmlContent,
  });
};

/* Contact: notify admin of new contact message */
const sendContactNotification = async (contact) => {
  const subject = `New Contact Message – ${contact.subject || contact.name}`;
  const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff">
        <h2 style="color:#0F172A">New Contact Message</h2>
        <p><strong>From:</strong> ${contact.customerName || contact.name} &lt;${contact.email}&gt;</p>
        <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
        <div style="margin-top:12px;padding:12px;background:#f3f4f6;border-radius:8px">${contact.message}</div>
      </div>
    `;

  await sendEmail({
    to: process.env.OWNER_EMAIL,
    toName: 'Admin',
    subject,
    htmlContent,
  });
};

/* Contact: send confirmation to customer after they submit a message */
const sendContactReceived = async (contact) => {
  const toEmail = contact.email;
  const toName = contact.customerName || contact.name || 'Customer';
  const subject = `We received your message - SJA Transport`;
  const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff">
        <h2 style="color:#0F172A">Thank you for contacting SJA Transport</h2>
        <p>Hi ${toName},</p>
        <p>We have received your message and our team will get back to you shortly.</p>
        <div style="margin-top:12px;padding:12px;background:#f3f4f6;border-radius:8px">${contact.message}</div>
        <p style="margin-top:12px">Regards,<br/>SJA Transport Team</p>
      </div>
    `;

  await sendEmail({
    to: toEmail,
    toName: toName,
    subject,
    htmlContent,
  });
};

/* Contact: send admin reply to customer */
const sendContactReply = async ({ to, subject, message, adminName }) => {
  const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff">
        <h2 style="color:#0F172A">Message from SJA Transport</h2>
        <p>Dear Customer,</p>
        <div style="margin-top:12px;padding:12px;background:#f3f4f6;border-radius:8px">${message}</div>
        <p style="margin-top:12px">Regards,<br/>${adminName || 'SJA Transport Team'}</p>
      </div>
    `;

  await sendEmail({
    to: to,
    toName: 'Customer',
    subject: subject || 'Reply from SJA Transport',
    htmlContent,
  });
};

module.exports = { sendBookingNotification, sendBookingConfirmation, sendBookingStatusUpdate, sendContactNotification, sendContactReceived, sendContactReply };
