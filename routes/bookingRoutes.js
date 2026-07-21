const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const bookingValidation = [
  body('customerName').notEmpty().withMessage('Customer name is required').trim(),
  body('phone').notEmpty().withMessage('Phone number is required').trim(),
  body('pickupLocation').notEmpty().withMessage('Pickup location is required').trim(),
  body('deliveryLocation').notEmpty().withMessage('Delivery location is required').trim(),
  body('pickupDate').notEmpty().withMessage('Pickup date is required').isISO8601().withMessage('Invalid date format'),
  body('email').optional().isEmail().withMessage('Invalid email address').trim(),
  body('goodsDescription').notEmpty().withMessage('Goods description is required').trim(),
  body('serviceType').notEmpty().withMessage('Service type is required').trim(),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required').trim(),
  body('destinationState').notEmpty().withMessage('Destination state is required').trim(),
];

// POST /api/bookings
router.post('/', bookingValidation, validate, createBooking);

// GET /api/bookings
router.get('/', protect, getAllBookings);

// GET /api/bookings/:id
router.get('/:id', protect, getBookingById);

// PUT /api/bookings/:id
router.put('/:id', protect, updateBooking);

// PATCH /api/bookings/:id/status
router.patch('/:id/status', protect, updateBookingStatus);

// DELETE /api/bookings/:id
router.delete('/:id', protect, deleteBooking);

module.exports = router;
