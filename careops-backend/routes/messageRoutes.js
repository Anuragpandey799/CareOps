import express from "express";
import {
  sendMessage,
  getMessagesByCustomer,
  markMessagesAsRead,
} from "../controllers/messageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:customerId", protect, getMessagesByCustomer);
router.put("/read/:customerId", protect, markMessagesAsRead);

export default router;
