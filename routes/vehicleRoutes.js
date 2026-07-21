const express = require('express');
const { body } = require('express-validator');
const {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const uploadVehicle = require('../middleware/uploadVehicle');
const validate = require('../middleware/validate');

const router = express.Router();

const vehicleValidation = [
  body('vehicleName').notEmpty().withMessage('Vehicle name is required').trim(),
  body('vehicleNumber').notEmpty().withMessage('Registration number is required').trim(),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required').trim(),
  body('capacity').notEmpty().withMessage('Capacity is required').trim(),
  body('suitableGoods').notEmpty().withMessage('Suitable goods description is required').trim(),
  body('driverName').notEmpty().withMessage('Driver name is required').trim(),
  body('driverPhone').notEmpty().withMessage('Driver phone is required').trim(),
];

router
  .route('/')
  .get(getAllVehicles)
  .post(protect, uploadVehicle.single('image'), vehicleValidation, validate, createVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .put(protect, uploadVehicle.single('image'), updateVehicle)
  .delete(protect, deleteVehicle);

module.exports = router;
