const express = require('express');
const router = express.Router();
const { getAdminProfile, updateAdminProfile, changePassword } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const uploadProfile = require('../middleware/uploadProfile');

router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, uploadProfile.single('profilePhoto'), updateAdminProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
