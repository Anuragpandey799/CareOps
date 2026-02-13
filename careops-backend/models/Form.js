import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fields: [
      {
        type: {
          type: String,
          enum: ["text", "email", "phone", "dropdown", "checkbox"],
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: {
          type: [String], // Only for dropdown/checkbox
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
export default Form;
