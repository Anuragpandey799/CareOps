import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT", "ADJUSTMENT"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ product: 1, createdAt: -1 });

const InventoryLog = mongoose.model(
  "InventoryLog",
  inventoryLogSchema
);

export default InventoryLog;
