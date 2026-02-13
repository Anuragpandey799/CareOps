import mongoose from "mongoose";
import Message from "../models/Message.js";
import Lead from "../models/Lead.js";
import { emitEvent } from "../websocket/socketServer.js";


// =============================
// SEND MESSAGE
// =============================
export const sendMessage = async (req, res) => {
  try {
    const { customer, content, type } = req.body;

    if (!customer || !content) {
      return res.status(400).json({
        message: "Customer and content are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const leadExists = await Lead.findById(customer);
    if (!leadExists) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const message = await Message.create({
      customer,
      content,
      type,
      sender: req.user?._id,
      direction: "Outbound",
      read: true,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("customer", "name");

    emitEvent("newMessage", populatedMessage);
    emitEvent("dashboardUpdated");

    res.status(201).json(populatedMessage);

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      message: "Server error while sending message",
    });
  }
};


// =============================
// GET CONVERSATION BY LEAD
// =============================
export const getMessagesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const messages = await Message.find({
      customer: customerId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({
      message: "Server error while fetching messages",
    });
  }
};


// =============================
// MARK AS READ
// =============================
export const markMessagesAsRead = async (req, res) => {
  try {
    const { customerId } = req.params;

    await Message.updateMany(
      {
        customer: customerId,
        read: false,
      },
      { read: true }
    );

    emitEvent("messagesRead", { customerId });
    emitEvent("dashboardUpdated");

    res.status(200).json({
      message: "Messages marked as read",
    });

  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({
      message: "Server error while updating messages",
    });
  }
};
