// models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Food", "Hygiene", "Medical", "Shelter"],
      required: true
    },
    stock: { type: Number, required: true },
    unit: { type: String, default: "Packets" },

    location: {
      district: String,
      city: String
    },

    status: {
      type: String,
      enum: ["Available", "Low Stock", "Allocated"],
      default: "Available"
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
