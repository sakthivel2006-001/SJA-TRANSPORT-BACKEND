const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true,
  },
  deliveryLocation: {
    type: String,
    required: [true, 'Delivery location is required'],
    trim: true,
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true,
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true,
  },
  destinationState: {
    type: String,
    required: [true, 'Destination state is required'],
    trim: true,
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required'],
  },
  goodsDescription: {
    type: String,
    required: [true, 'Goods description is required'],
    trim: true,
  },
  additionalNotes: {
    type: String,
    trim: true,
    default: '',
  },
  distance: {
    type: String,
    trim: true,
    default: '',
  },
  estimatedPrice: {
    type: String,
    trim: true,
    default: '',
  },
  trackingId: {
    type: String,
    trim: true,
    default: '',
  },
  bookingId: {
    type: String,
    trim: true,
    unique: true,
    index: true,
  },
  bookingStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
