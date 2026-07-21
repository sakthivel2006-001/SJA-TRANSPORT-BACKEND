const express = require('express');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  reorderServices,
} = require('../controllers/transportServiceController');
const { protect } = require('../middleware/authMiddleware');
const uploadService = require('../middleware/uploadService');

const router = express.Router();

router
  .route('/')
  .get(getAllServices)
  .post(protect, uploadService.single('image'), createService);

router
  .route('/:id')
  .get(getService)
  .put(protect, uploadService.single('image'), updateService)
  .delete(protect, deleteService);

router.post('/reorder', protect, reorderServices);

module.exports = router;
