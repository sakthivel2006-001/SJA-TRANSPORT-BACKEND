const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  deleteContactMessage,
  getContactMessageById,
  markContactRead,
  replyContactMessage,
  updateContactStatus,
} = require('../controllers/contactController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const contactValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('phone').notEmpty().withMessage('Phone is required').trim(),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('subject').notEmpty().withMessage('Subject is required').trim(),
  body('message').notEmpty().withMessage('Message is required').trim(),
];

router.post('/', contactValidation, validate, createContactMessage);
router.get('/', protect, getContactMessages);
router.delete('/:id', protect, deleteContactMessage);

// single message
router.get('/:id', protect, getContactMessageById);

// mark as read
router.patch('/:id/read', protect, markContactRead);

// update status
const statusValidation = [
  body('status').notEmpty().withMessage('Status is required').isIn(['New', 'Read', 'Replied']).withMessage('Invalid status'),
];
router.patch('/:id/status', protect, statusValidation, validate, updateContactStatus);

// reply to message (admin)
const replyValidation = [
  body('message').notEmpty().withMessage('Reply message is required').trim(),
];
router.patch('/:id/reply', protect, replyValidation, validate, replyContactMessage);

module.exports = router;
