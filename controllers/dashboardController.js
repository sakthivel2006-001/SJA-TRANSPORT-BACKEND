const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const Gallery = require('../models/Gallery');
const TransportService = require('../models/TransportService');
const Vehicle = require('../models/Vehicle');
const ContactMessage = require('../models/ContactMessage');

exports.getStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [
      totalBookings,
      todayBookings,
      monthlyBookings,
      pendingBookings,
      approvedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      totalCustomersDistinctPhones,
      totalFeedback,
      approvedReviews,
      galleryImages,
      services,
      totalVehicles,
      availableVehicles,
      onTripVehicles,
      maintenanceVehicles,
      contactMessages,
      contactNewCount,
      contactRepliedCount,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfToday } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth, $lt: startOfNextMonth } }),
      Booking.countDocuments({ bookingStatus: 'Pending' }),
      Booking.countDocuments({ bookingStatus: 'Approved' }),
      Booking.countDocuments({ bookingStatus: 'In Progress' }),
      Booking.countDocuments({ bookingStatus: 'Completed' }),
      Booking.countDocuments({ bookingStatus: 'Cancelled' }),
      Booking.distinct('phone', { phone: { $ne: null, $ne: '' } }).then(arr => arr.length),
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: 'approved' }),
      Gallery.countDocuments(),
      TransportService.countDocuments({ isActive: true }),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'Available' }),
      Vehicle.countDocuments({ status: 'On Trip' }),
      Vehicle.countDocuments({ status: 'Maintenance' }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'New' }),
      ContactMessage.countDocuments({ status: 'Replied' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        monthlyBookings,
        pendingBookings,
        approvedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        // legacy keys
        confirmedBookings: approvedBookings,
        completedDeliveries: completedBookings,
        totalCustomers: totalCustomersDistinctPhones,
        totalFeedback,
        approvedReviews,
        galleryImages,
        services,
        vehicles: totalVehicles, // legacy key mapping
        totalVehicles,
        availableVehicles,
        onTripVehicles,
        maintenanceVehicles,
        contactMessages,
        contactNew: contactNewCount,
        contactReplied: contactRepliedCount,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
