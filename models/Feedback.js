const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  vehicle: {
    type: String,
    required: [true, 'Vehicle used is required'],
    trim: true,
  },
  service: {
    type: String,
    required: [true, 'Service used is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
