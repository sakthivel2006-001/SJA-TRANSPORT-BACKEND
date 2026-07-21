const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createGalleryItem,
  getGalleryItems,
  getFeaturedGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
  likeGalleryItem,
} = require('../controllers/galleryController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const galleryValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').optional().trim(),
  body('category').optional().trim(),
];

router.post('/', protect, upload.single('image'), galleryValidation, validate, createGalleryItem);
router.get('/', getGalleryItems);
router.get('/featured', getFeaturedGalleryItems);
router.put('/:id', protect, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);
router.post('/reorder', protect, reorderGalleryItems);
router.patch('/:id/like', likeGalleryItem);
router.post('/:id/like', likeGalleryItem);

module.exports = router;
