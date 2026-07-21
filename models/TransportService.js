const mongoose = require('mongoose');

const transportServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
  },
  icon: {
    type: String, // String identifier for lucide-react icon, e.g. "Home", "Package"
    default: 'Package',
  },
  capacity: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  image: {
    type: String, // URL or base64
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('TransportService', transportServiceSchema);
