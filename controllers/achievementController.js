const Achievement = require('../models/Achievement');
const asyncHandler = require('../utils/asyncHandler');

const ALLOWED_FIELDS = ['title', 'value', 'description', 'icon', 'image', 'displayOrder'];

/** Pick only allowed fields from the request body */
const sanitize = (body) => {
  const clean = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) {
      clean[key] = body[key];
    }
  }
  return clean;
};

// @desc    Create achievement
// @route   POST /api/achievements
exports.createAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.create(sanitize(req.body));
  res.status(201).json({
    success: true,
    message: 'Achievement created successfully',
    data: achievement,
  });
});

// @desc    Get all achievements
// @route   GET /api/achievements
exports.getAchievements = asyncHandler(async (_req, res) => {
  const achievements = await Achievement.find().sort({ displayOrder: 1, createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Achievements fetched successfully',
    data: achievements,
  });
});

// @desc    Get single achievement
// @route   GET /api/achievements/:id
exports.getAchievementById = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) {
    return res.status(404).json({ success: false, message: 'Achievement not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Achievement fetched successfully',
    data: achievement,
  });
});

// @desc    Update achievement
// @route   PUT /api/achievements/:id
exports.updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndUpdate(req.params.id, sanitize(req.body), {
    new: true,
    runValidators: true,
  });
  if (!achievement) {
    return res.status(404).json({ success: false, message: 'Achievement not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Achievement updated successfully',
    data: achievement,
  });
});

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
exports.deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);
  if (!achievement) {
    return res.status(404).json({ success: false, message: 'Achievement not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Achievement deleted successfully',
    data: {},
  });
});
