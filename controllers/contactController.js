const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification, sendContactReply, sendContactReceived } = require('../services/emailService');

// @desc    Submit a contact message
// @route   POST /api/contact
exports.createContactMessage = asyncHandler(async (req, res) => {
  const data = req.body || {};
  // normalize customerName if provided as name
  if (!data.customerName && data.name) data.customerName = data.name;

  const message = await ContactMessage.create(data);

  // notify admin and send customer confirmation (best-effort, do not block response)
  Promise.allSettled([
    sendContactNotification(message).catch(err => console.error('Failed to send contact notification email:', err.message)),
    sendContactReceived(message).catch(err => console.error('Failed to send contact confirmation email:', err.message)),
  ]);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: message,
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
exports.getContactMessages = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Contact messages fetched successfully',
    data: messages,
  });
});

// @desc    Get a single contact message
// @route   GET /api/contact/:id
exports.getContactMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Contact message not found' });
  }
  res.status(200).json({ success: true, data: message });
});

// @desc    Mark contact message as read
// @route   PATCH /api/contact/:id/read
exports.markContactRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) return res.status(404).json({ success: false, message: 'Contact message not found' });
  message.isRead = true;
  message.status = 'Read';
  await message.save();
  res.status(200).json({ success: true, message: 'Marked as read', data: message });
});

// @desc    Reply to a contact message (admin)
// @route   PATCH /api/contact/:id/reply
exports.replyContactMessage = asyncHandler(async (req, res) => {
  const { message: replyMessage, subject } = req.body;
  if (!replyMessage) return res.status(400).json({ success: false, message: 'Reply message is required' });

  const contact = await ContactMessage.findById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact message not found' });

  const adminName = (req.admin && (req.admin.name || req.admin.email)) || 'Admin';

  // append to replies history
  contact.replies = contact.replies || [];
  contact.replies.push({ adminName, message: replyMessage, date: new Date() });

  // update last reply fields
  contact.reply = replyMessage;
  contact.adminReply = replyMessage;
  contact.replyDate = new Date();
  contact.status = 'Replied';
  contact.isRead = true;

  await contact.save();

  // send reply email to customer
  try {
    await sendContactReply({
      to: contact.email,
      subject: subject || `Reply from SJA Transport`,
      message: `Hello ${contact.customerName || contact.name || ''},<br/><br/>Thank you for contacting SJA Transport.<br/><br/>Our response:<br/>${replyMessage}<br/><br/>If you need any further assistance, please contact us.<br/><br/>Regards,<br/>SJA Transport Team`,
      adminName,
    });
  } catch (err) {
    console.error('Failed to send reply email:', err.message);
  }

  res.status(200).json({ success: true, message: 'Reply sent', data: contact });
});

// @desc    Update contact message status (admin)
// @route   PATCH /api/contact/:id/status
exports.updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['New', 'Read', 'Replied'];
  if (!status || !allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

  const contact = await ContactMessage.findById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact message not found' });

  contact.status = status;
  if (status === 'Read') contact.isRead = true;
  await contact.save();

  res.status(200).json({ success: true, message: 'Status updated', data: contact });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
exports.deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Contact message not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Contact message deleted successfully',
    data: {},
  });
});
