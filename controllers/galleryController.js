const path = require('path');
const Gallery = require('../models/Gallery');
const asyncHandler = require('../utils/asyncHandler');

const normalizePayload = (body, file) => {
  const payload = {
    title: body.title,
    description: body.description || '',
    category: body.category || 'Fleet Vehicles',
    isFeatured:
      body.featured === true ||
      body.featured === 'true' ||
      body.isFeatured === true ||
      body.isFeatured === 'true',
    vehicleName: body.vehicleName || '',
    capacity: body.capacity || '',
    pickupLocation: body.pickupLocation || '',
    deliveryLocation: body.deliveryLocation || '',
    serviceType: body.serviceType || '',
    vehicleUsed: body.vehicleUsed || '',
    deliveryDate: body.completedDate || body.deliveryDate || '',
    uploadedBy: body.uploadedBy || '',
    order: body.order ?? 0,
    likesCount: Number(body.likes ?? body.likesCount ?? 0) || 0,
  };
  
  if (file) {
    payload.imageUrl = `/uploads/gallery/${file.filename}`;
  } else if (body.imageUrl) {
    payload.imageUrl = body.imageUrl;
  } else if (body.image) {
    payload.imageUrl = body.image;
  }
  
  return payload;
};

// @desc    Add gallery image
// @route   POST /api/gallery
exports.createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file && !req.body.imageUrl && !req.body.image) {
    return res.status(400).json({
      success: false,
      message: 'Gallery image file is required',
    });
  }

  const item = await Gallery.create(normalizePayload(req.body, req.file));
  res.status(201).json({
    success: true,
    message: 'Gallery item added successfully',
    data: item,
  });
});

// @desc    Get all gallery images
// @route   GET /api/gallery
exports.getGalleryItems = asyncHandler(async (_req, res) => {
  const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Gallery fetched successfully',
    data: items,
  });
});

// @desc    Get featured gallery images
// @route   GET /api/gallery/featured
exports.getFeaturedGalleryItems = asyncHandler(async (_req, res) => {
  const items = await Gallery.find({ isFeatured: true }).sort({ order: 1, createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Featured gallery fetched successfully',
    data: items,
  });
});

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
exports.updateGalleryItem = asyncHandler(async (req, res) => {
  const oldItem = await Gallery.findById(req.params.id);
  if (!oldItem) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  const payload = normalizePayload(req.body, req.file);
  const item = await Gallery.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  
  if (req.file && oldItem.imageUrl && oldItem.imageUrl !== payload.imageUrl) {
    const imagePath = oldItem.imageUrl.replace(/^\/+/, '');
    const filePath = path.join(__dirname, '..', imagePath);
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: item,
  });
});

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
exports.deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }
  
  if (item.imageUrl) {
    const imagePath = item.imageUrl.replace(/^\/+/, '');
    const filePath = path.join(__dirname, '..', imagePath);
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully',
    data: {},
  });
});

// @desc    Reorder gallery images
// @route   POST /api/gallery/reorder
exports.reorderGalleryItems = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ success: false, message: 'orderedIds array is required' });
  }

  const updates = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));

  await Gallery.bulkWrite(updates);
  const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, message: 'Gallery reordered successfully', data: items });
});

// @desc    Like a gallery image
// @route   PATCH /api/gallery/:id/like
exports.likeGalleryItem = asyncHandler(async (req, res) => {
  const anonymousId = req.body?.anonymousId?.toString()?.trim();
  let item;

  if (anonymousId) {
    item = await Gallery.findOneAndUpdate(
      { _id: req.params.id, likedBy: { $ne: anonymousId } },
      { $inc: { likesCount: 1 }, $addToSet: { likedBy: anonymousId } },
      { new: true, runValidators: true }
    );

    if (!item) {
      const existingItem = await Gallery.findById(req.params.id);
      if (!existingItem) {
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Already liked',
        data: existingItem,
      });
    }
  } else {
    item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $inc: { likesCount: 1 } },
      { new: true, runValidators: true }
    );
  }

  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  res.status(200).json({ success: true, message: 'Like count incremented', data: item });
});
