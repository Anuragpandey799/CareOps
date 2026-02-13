import express from "express";
import {
  createProduct,
  getProducts,
  updateStock,
  deleteProduct,
} from "../controllers/inventoryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createProduct)
  .get(protect, getProducts);

router.put("/:id/stock", protect, updateStock);
router.delete("/:id", protect, deleteProduct);

export default router;
