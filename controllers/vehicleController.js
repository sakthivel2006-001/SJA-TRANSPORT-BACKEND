const path = require('path');
const fs = require('fs');
const Vehicle = require('../models/Vehicle');
const asyncHandler = require('../utils/asyncHandler');

const normalizePayload = (body, file) => {
  const payload = {
    vehicleName: body.vehicleName,
    vehicleNumber: body.vehicleNumber,
    vehicleType: body.vehicleType,
    capacity: body.capacity,
    suitableGoods: body.suitableGoods,
    driverName: body.driverName,
    driverPhone: body.driverPhone,
    status: body.status || 'Available',
    description: body.description || '',
    featured: body.featured === 'true' || body.featured === true,
  };
  
  if (file) {
    payload.image = `/uploads/vehicles/${file.filename}`;
  } else if (body.image) {
    payload.image = body.image;
  }
  
  return payload;
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
exports.getAllVehicles = asyncHandler(async (req, res) => {
  const { search, vehicleType, status, sort, page, limit } = req.query;
  
  let query = {};
  
  if (search) {
    query.$or = [
      { vehicleName: { $regex: search, $options: 'i' } },
      { vehicleNumber: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }
  
  if (status) {
    query.status = status;
  }
  
  let sortOption = { createdAt: -1 };
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'name') {
    sortOption = { vehicleName: 1 };
  }
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50; // default large enough for table without pagination if not specified
  const skip = (pageNum - 1) * limitNum;
  
  const total = await Vehicle.countDocuments(query);
  const vehicles = await Vehicle.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);
    
  res.status(200).json({
    success: true,
    count: vehicles.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: vehicles
  });
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
exports.getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.status(200).json({ success: true, data: vehicle });
});

// @desc    Create a vehicle
// @route   POST /api/vehicles
exports.createVehicle = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Vehicle image is required' });
  }
  
  const payload = normalizePayload(req.body, req.file);
  const vehicle = await Vehicle.create(payload);
  
  res.status(201).json({ success: true, data: vehicle });
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = asyncHandler(async (req, res) => {
  const oldVehicle = await Vehicle.findById(req.params.id);
  if (!oldVehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  const payload = normalizePayload(req.body, req.file);
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  
  if (req.file && oldVehicle.image && oldVehicle.image !== payload.image) {
    const filePath = path.join(__dirname, '..', oldVehicle.image);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }
  }

  res.status(200).json({ success: true, data: vehicle });
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  
  if (vehicle.image) {
    const filePath = path.join(__dirname, '..', vehicle.image);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }

  res.status(200).json({ success: true, data: {} });
});
