import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    // 🔐 RBAC
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    // New fields for Volunteer SignUp
    location: {
      type: String,
      trim: true,
    },
    photo: {
      type: String, // URL of the uploaded photo
    },
    skills: {
      medical: { type: Boolean, default: false },
      translation: { type: Boolean, default: false },
      construction: { type: Boolean, default: false },
      foodDistribution: { type: Boolean, default: false },
      logistics: { type: Boolean, default: false },
      transport: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("User", userSchema);
