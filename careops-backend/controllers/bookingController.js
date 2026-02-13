import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Lead from "../models/Lead.js";
import { emitEvent } from "../websocket/socketServer.js";


// ===============================
// CREATE BOOKING
// ===============================
const createBooking = async (req, res) => {
  try {
    const { customer, service, date, durationMinutes, notes } = req.body;

    // ✅ Required validation
    if (!customer || !service || !date) {
      return res.status(400).json({
        message: "Customer, service and date are required",
      });
    }

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    // ✅ Check Lead exists
    const leadExists = await Lead.findById(customer);
    if (!leadExists) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      customer,
      service,
      date,
      durationMinutes,
      notes,
      staffAssigned: req.user?._id || null,
      createdBy: req.user?._id || null,
    });

    // ✅ Update Lead status
    await Lead.findByIdAndUpdate(customer, {
      status: "Booked",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone status")
      .populate("staffAssigned", "name email role");

    // ✅ Emit events
    emitEvent("bookingCreated", populatedBooking);
    emitEvent("leadUpdated", {
      leadId: customer,
      status: "Booked",
    });
    emitEvent("dashboardUpdated"),

    res.status(201).json(populatedBooking);

  } catch (error) {
    console.error("Create Booking Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "Server error while creating booking",
    });
  }
};


// ===============================
// GET ALL BOOKINGS
// ===============================
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone status")
      .populate("staffAssigned", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({
      message: "Server error while fetching bookings",
    });
  }
};


// ===============================
// GET SINGLE BOOKING
// ===============================
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("customer", "name email phone status")
      .populate("staffAssigned", "name email role");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);

  } catch (error) {
    console.error("Get Booking By ID Error:", error);
    res.status(500).json({
      message: "Server error while fetching booking",
    });
  }
};


// ===============================
// UPDATE BOOKING
// ===============================
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("customer", "name email phone status")
      .populate("staffAssigned", "name email role");

    // ✅ If status changed to Completed → update Lead
    if (req.body.status === "Completed") {
      await Lead.findByIdAndUpdate(updatedBooking.customer._id, {
        status: "Converted",
      });

      emitEvent("leadUpdated", {
        leadId: updatedBooking.customer._id,
        status: "Converted",
      });
      emitEvent("dashboardUpdated");
    }

    emitEvent("bookingUpdated", updatedBooking);
    emitEvent("dashboardUpdated");

    res.status(200).json(updatedBooking);

  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({
      message: "Server error while updating booking",
    });
  }
};


// ===============================
// DELETE BOOKING
// ===============================
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await Booking.findByIdAndDelete(id);

    emitEvent("bookingDeleted", { bookingId: id });
    emitEvent("dashboardUpdated");

    res.status(200).json({
      message: "Booking removed successfully",
    });

  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({
      message: "Server error while deleting booking",
    });
  }
};


export {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
