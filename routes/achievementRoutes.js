const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const achievementValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('value').notEmpty().withMessage('Value is required').trim(),
  body('description').notEmpty().withMessage('Description is required').trim(),
];

router.post('/', protect, achievementValidation, validate, createAchievement);
router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.put('/:id', protect, achievementValidation, validate, updateAchievement);
router.delete('/:id', protect, deleteAchievement);

module.exports = router;
