const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  value: {
    type: String,
    required: [true, 'Value is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    trim: true,
    default: '',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
