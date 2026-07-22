const path = require('path');
const fs = require('fs');
const TransportService = require('../models/TransportService');

exports.getAllServices = async (req, res) => {
  try {
    const filter = {};
    // By default return only active services for public endpoints. Pass ?includeInactive=true to include all.
    if (req.query.includeInactive !== 'true') {
      filter.isActive = true;
    }

    const services = await TransportService.find(filter).sort('displayOrder');
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await TransportService.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createService = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.path;
    }
    // Normalize boolean fields
    if (typeof payload.isActive === 'string') {
      payload.isActive = payload.isActive === 'true' || payload.isActive === '1';
    }

    // Ensure isActive defaults to true
    if (payload.isActive === undefined || payload.isActive === null) {
      payload.isActive = true;
    }

    // Auto-assign displayOrder if not provided
    if (payload.displayOrder === undefined || payload.displayOrder === null || payload.displayOrder === '') {
      const last = await TransportService.findOne().sort({ displayOrder: -1 }).select('displayOrder').lean();
      const nextOrder = last && typeof last.displayOrder === 'number' ? last.displayOrder + 1 : 1;
      payload.displayOrder = nextOrder;
    }

    const service = await TransportService.create(payload);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const existing = await TransportService.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Service not found' });

    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.path;
    }

    // Normalize boolean
    if (typeof payload.isActive === 'string') {
      payload.isActive = payload.isActive === 'true' || payload.isActive === '1';
    }

    // If displayOrder is omitted, keep existing value
    if (payload.displayOrder === undefined || payload.displayOrder === null || payload.displayOrder === '') {
      payload.displayOrder = existing.displayOrder;
    }

    const service = await TransportService.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    // Cloudinary manages file overwrites/deletions natively when configured

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await TransportService.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    // Cloudinary image will remain or can be deleted via Cloudinary API separately

    await service.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Reorder services
exports.reorderServices = async (req, res) => {
  try {
    const { orderedIds } = req.body || {};
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds array is required' });
    }

    const updates = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));

    await TransportService.bulkWrite(updates);
    const items = await TransportService.find().sort('displayOrder');
    res.status(200).json({ success: true, message: 'Services reordered successfully', data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
