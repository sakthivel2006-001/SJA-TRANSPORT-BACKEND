const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true,
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true,
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true,
  },
  capacity: {
    type: String,
    required: [true, 'Capacity is required'],
    trim: true,
  },
  suitableGoods: {
    type: String,
    required: [true, 'Suitable goods description is required'],
    trim: true,
  },
  driverName: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true,
  },
  driverPhone: {
    type: String,
    required: [true, 'Driver phone is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Maintenance'],
    default: 'Available',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Vehicle image is required'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
