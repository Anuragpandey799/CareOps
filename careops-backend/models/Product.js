import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    cost: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    stockStatus: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 🔥 Auto-update stock status
productSchema.pre("save", function () {
  if (this.stockQuantity === 0) {
    this.stockStatus = "Out of Stock";
  } else if (this.stockQuantity <= this.lowStockThreshold) {
    this.stockStatus = "Low Stock";
  } else {
    this.stockStatus = "In Stock";
  }
});

productSchema.index({ name: 1 });
// productSchema.index({ sku: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
