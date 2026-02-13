import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createLead)
  .get(protect, getLeads);

router
  .route("/:id")
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

export default router;
