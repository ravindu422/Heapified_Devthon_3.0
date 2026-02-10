import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      required: true,
      enum: ["Critical", "High", "Medium", "Low"],
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    originalTaskId: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
