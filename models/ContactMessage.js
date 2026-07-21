const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  // keep legacy `name` for backward compatibility
  name: {
    type: String,
    trim: true,
    default: '',
  },
  customerName: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  subject: {
    type: String,
    trim: true,
    default: '',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied'],
    default: 'New',
  },
  // Last admin reply
  reply: {
    type: String,
    trim: true,
    default: '',
  },
  adminReply: {
    type: String,
    trim: true,
    default: '',
  },
  replyDate: {
    type: Date,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  // History of replies
  replies: [
    {
      adminName: { type: String, trim: true },
      message: { type: String, trim: true },
      date: { type: Date },
    },
  ],
}, { timestamps: true });

// Ensure customerName is populated from legacy `name` if not provided
contactMessageSchema.pre('save', function (next) {
  if (!this.customerName && this.name) {
    this.customerName = this.name;
  }
  next();
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
