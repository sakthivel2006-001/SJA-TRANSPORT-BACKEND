const Admin = require('../models/Admin');
const path = require('path');
const fs = require('fs');

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: admin,
      });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Update text fields
    if (req.body.name) admin.name = req.body.name;
    if (req.body.email) admin.email = req.body.email;
    if (req.body.phone !== undefined) admin.phone = req.body.phone;

    // Handle profile photo upload
    if (req.file) {
      // Cloudinary handles storage; no need to delete local file
      admin.profilePhoto = req.file.path;
    }

    const updatedAdmin = await admin.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        profilePhoto: updatedAdmin.profilePhoto,
        role: updatedAdmin.role,
        lastLogin: updatedAdmin.lastLogin,
      },
    });
  } catch (error) {
    // If it's a validation error from mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    // Check for duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    // Update password (hashing is handled by mongoose pre-save hook)
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  changePassword,
};
