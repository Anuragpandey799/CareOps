import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: [true, "Customer (Lead) is required"],
    },

    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Booking date is required"],
    },

    durationMinutes: {
      type: Number,
      default: 60,
      min: 15,
    },

    staffAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    notes: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
