const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create feedback
// @route   POST /api/feedback
exports.createFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: feedback,
  });
});

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
exports.getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Feedback fetched successfully',
    data: feedback,
  });
});

// @desc    Get approved feedback (public)
// @route   GET /api/feedback/public
exports.getApprovedFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ status: 'approved' }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Approved feedback fetched successfully',
    data: feedback,
  });
});

// @desc    Update feedback status
// @route   PATCH /api/feedback/:id/status
exports.updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    return res.status(404).json({ success: false, message: 'Feedback not found' });
  }

  feedback.status = status;
  // Fallback for legacy records:
  feedback.approved = status === 'approved';
  
  await feedback.save();

  res.status(200).json({
    success: true,
    message: 'Feedback status updated successfully',
    data: feedback,
  });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
exports.deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);
  if (!feedback) {
    return res.status(404).json({ success: false, message: 'Feedback not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Feedback deleted successfully',
    data: {},
  });
});
