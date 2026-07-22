const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const { sendBookingNotification, sendBookingConfirmation, sendBookingStatusUpdate } = require('../services/emailService');

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = asyncHandler(async (req, res) => {
  // Prevent duplicate bookings: same phone + pickupDate + pickupLocation
  const { phone, pickupDate, pickupLocation } = req.body;
  if (phone && pickupDate && pickupLocation) {
    const existing = await Booking.findOne({ phone: phone.trim(), pickupDate: new Date(pickupDate), pickupLocation: pickupLocation.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A booking with the same phone, pickup date and location already exists' });
    }
  }

  // Ensure pickupDate is stored as a Date
  if (req.body.pickupDate) {
    req.body.pickupDate = new Date(req.body.pickupDate);
  }

  // Add a simple trackingId if not provided
  if (!req.body.trackingId) {
    req.body.trackingId = `BK-${Date.now().toString().slice(-6)}-${Math.round(Math.random() * 9999)}`;
  }

  // Generate a bookingId in format SJA-YYYYMMDD-### (sequence per day)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const todaysCount = await Booking.countDocuments({ createdAt: { $gte: startOfDay, $lt: endOfDay } });
  const seq = String(todaysCount + 1).padStart(3, '0');
  req.body.bookingId = `SJA-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${seq}`;

  const booking = await Booking.create(req.body);

  // Send emails: notification to admin (best-effort asynchronously)
  Promise.allSettled([
    // sendBookingConfirmation(booking).catch(err => console.error('Failed to send booking confirmation:', err.message)),
    sendBookingNotification(booking).catch(err => console.error('Email notification failed:', err.message))
  ]);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

// @desc    Get all bookings
// @route   GET /api/bookings
exports.getAllBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Bookings fetched successfully',
    data: bookings,
  });
});

// @desc    Get a single booking
// @route   GET /api/bookings/:id
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Booking fetched successfully',
    data: booking,
  });
});

// @desc    Update a booking
// @route   PUT /api/bookings/:id
exports.updateBooking = asyncHandler(async (req, res) => {
  // Ensure pickupDate is stored as Date when updating
  if (req.body.pickupDate) req.body.pickupDate = new Date(req.body.pickupDate);

  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: booking,
  });
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus } = req.body;
  if (!bookingStatus) {
    return res.status(400).json({ success: false, message: 'Booking status is required' });
  }

  const allowed = ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Cancelled'];
  if (!allowed.includes(bookingStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid booking status' });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.bookingStatus = bookingStatus;
  await booking.save();

  // Send status update email to customer (best-effort)
  try {
    await sendBookingStatusUpdate(booking);
  } catch (err) {
    console.error('Failed to send booking status update:', err.message);
  }

  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    data: booking,
  });
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully',
    data: {},
  });
});
