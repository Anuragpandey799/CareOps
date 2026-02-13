import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true, // 🔥 faster conversation queries
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["SMS", "Email", "Chat"],
      default: "Chat",
    },

    direction: {
      type: String,
      enum: ["Inbound", "Outbound"],
      default: "Outbound",
    },

    read: {
      type: Boolean,
      default: false,
    },

    attachments: [
      {
        type: String, // file URLs (future use)
      },
    ],
  },
  { timestamps: true }
);

// 🔥 Compound index for conversation sorting
messageSchema.index({ customer: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
