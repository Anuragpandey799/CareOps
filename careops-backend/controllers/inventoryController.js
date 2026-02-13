import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import mongoose from "mongoose";
import { emitEvent } from "../websocket/socketServer.js";

// =============================
// CREATE PRODUCT
// =============================
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      lastUpdatedBy: req.user._id,
    });

    emitEvent("productCreated", product);
    emitEvent("dashboardUpdated");

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating product",
    });
  }
};

// =============================
// GET ALL PRODUCTS
// =============================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("lastUpdatedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch {
    res.status(500).json({
      message: "Error fetching products",
    });
  }
};

// =============================
// UPDATE STOCK
// =============================
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({
        message: "Invalid product ID",
      });

    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    if (type === "OUT" && product.stockQuantity < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    if (type === "IN")
      product.stockQuantity += quantity;
    else if (type === "OUT")
      product.stockQuantity -= quantity;
    else if (type === "ADJUSTMENT")
      product.stockQuantity = quantity;

    product.lastUpdatedBy = req.user._id;

    await product.save();

    await InventoryLog.create({
      product: id,
      type,
      quantity,
      performedBy: req.user._id,
    });

    emitEvent("stockUpdated", product);
    emitEvent("dashboardUpdated");

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error updating stock",
    });
  }
};

// =============================
// DELETE PRODUCT
// =============================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    emitEvent("productDeleted", { id });
    emitEvent("dashboardUpdated");

    res.status(200).json({
      message: "Product deleted",
    });
  } catch {
    res.status(500).json({
      message: "Error deleting product",
    });
  }
};
