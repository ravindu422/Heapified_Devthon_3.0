import mongoose from "mongoose";

const contactAvailabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availability: {
      date: {
        type: Date,
        required: true,
      },
      time: {
        hour: { type: String, required: true },
        minute: { type: String, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true },
      },
      notes: {
        type: String,
        default: "",
      },
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("ContactAvailability", contactAvailabilitySchema);
