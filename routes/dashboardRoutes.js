const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only dashboard stats
router.get('/stats', protect, getStats);

module.exports = router;
