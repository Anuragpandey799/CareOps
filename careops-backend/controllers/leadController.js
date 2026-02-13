import Lead from "../models/Lead.js";
import { emitEvent } from "../websocket/socketServer.js";

// @desc Create a new lead
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body
    });

    emitEvent("leadCreated", lead);
    emitEvent("dashboardUpdated");

    res.status(201).json(lead);
  } catch (error) {
    console.error(error); // 👈 Add this for debugging
    res.status(500).json({ message: error.message });
  }
};


// @desc Get all leads
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate(
      "assignedTo",
      "name email role"
    );

    res.json(leads);
  } catch (error) {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  res.status(500).json({ message: "Server Error" });
}

};

// @desc Get single lead
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assignedTo",
      "name email role"
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update lead
const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    emitEvent("leadUpdated", updatedLead);
    emitEvent("dashboardUpdated");

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await Lead.findByIdAndDelete(req.params.id);

    emitEvent("leadDeleted", { id: req.params.id });
    emitEvent("dashboardUpdated");

    res.json({ message: "Lead removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
