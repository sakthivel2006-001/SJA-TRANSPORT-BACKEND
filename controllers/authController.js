const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (admin && (await admin.comparePassword(password))) {
      admin.lastLogin = new Date();
      await admin.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = (req, res) => {
  // Since JWT is stateless, logout is handled client-side by deleting the token.
  // This endpoint is just a convenience.
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  loginAdmin,
  logoutAdmin,
};
