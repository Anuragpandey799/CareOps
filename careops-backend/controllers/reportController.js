import Lead from "../models/Lead.js";
import Booking from "../models/Booking.js";
import Product from "../models/Product.js";
import Message from "../models/Message.js";

// Helper to get date range
const getDateFilter = (range) => {
  const now = new Date();
  let start;

  if (range === "today") {
    start = new Date(now.setHours(0, 0, 0, 0));
  } else if (range === "week") {
    start = new Date();
    start.setDate(start.getDate() - 7);
  } else if (range === "month") {
    start = new Date();
    start.setMonth(start.getMonth() - 1);
  }

  return start ? { createdAt: { $gte: start } } : {};
};

export const getSummaryReport = async (req, res) => {
  try {
    const { range } = req.query;
    const dateFilter = getDateFilter(range);

    const totalLeads = await Lead.countDocuments(dateFilter);
    const totalBookings = await Booking.countDocuments(dateFilter);

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Revenue over time
    const revenueOverTime = await Booking.aggregate([
      { $match: { ...dateFilter, status: "Completed" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Inventory status breakdown
    const inventoryStatus = await Product.aggregate([
      { $group: { _id: "$stockStatus", count: { $sum: 1 } } },
    ]);

    const unreadMessages = await Message.countDocuments({ read: false });

    res.json({
      totalLeads,
      totalBookings,
      leadsByStatus,
      bookingsByStatus,
      revenueOverTime,
      inventoryStatus,
      unreadMessages,
    });
  } catch (err) {
    res.status(500).json({ message: "Report generation failed" });
  }
};
