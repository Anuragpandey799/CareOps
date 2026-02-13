import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createBooking)
  .get(protect, getBookings);

router
  .route("/:id")
  .get(protect, getBookingById)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

export default router;
