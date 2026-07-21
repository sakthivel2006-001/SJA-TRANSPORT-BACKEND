const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
];

router.post('/login', loginValidation, loginAdmin);
router.post('/logout', protect, logoutAdmin);

module.exports = router;
