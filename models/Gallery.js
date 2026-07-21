const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'Fleet Vehicles',
  },
  isFeatured: {
    type: Boolean,
    default: false,
    alias: 'featured',
  },
  vehicleName: {
    type: String,
    trim: true,
    default: '',
  },
  capacity: {
    type: String,
    trim: true,
    default: '',
  },
  pickupLocation: {
    type: String,
    trim: true,
    default: '',
  },
  deliveryLocation: {
    type: String,
    trim: true,
    default: '',
  },
  serviceType: {
    type: String,
    trim: true,
    default: '',
  },
  vehicleUsed: {
    type: String,
    trim: true,
    default: '',
  },
  deliveryDate: {
    type: String,
    trim: true,
    default: '',
    alias: 'completedDate',
  },
  order: {
    type: Number,
    default: 0,
  },
  likesCount: {
    type: Number,
    default: 0,
    alias: 'likes',
  },
  uploadedBy: {
    type: String,
    trim: true,
    default: '',
  },
  likedBy: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

gallerySchema.virtual('image').get(function () {
  return this.imageUrl;
});

module.exports = mongoose.model('Gallery', gallerySchema);
