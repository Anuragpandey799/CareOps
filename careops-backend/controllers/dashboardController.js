import Lead from "../models/Lead.js";
import Booking from "../models/Booking.js";
import Product from "../models/Product.js";
import Message from "../models/Message.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ================= TODAY DATA =================
    const todayLeads = await Lead.countDocuments({
      createdAt: { $gte: today },
    });

    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today },
    });

    const todayRevenueAgg = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    // ================= LEAD FUNNEL =================
    const leadFunnel = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // ================= UPCOMING BOOKINGS =================
    const upcomingBookings = await Booking.find({
      status: "Scheduled",
    })
      .sort({ date: 1 })
      .limit(5)
      .populate("lead", "name phone");

    // ================= LOW STOCK =================
    const lowStock = await Product.find({
      stockStatus: { $in: ["Low Stock", "Out of Stock"] },
    }).limit(5);

    // ================= RECENT ACTIVITY =================
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(3);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      todayLeads,
      todayBookings,
      todayRevenue,
      leadFunnel,
      upcomingBookings,
      lowStock,
      recentLeads,
      recentBookings,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard failed" });
  }
};
