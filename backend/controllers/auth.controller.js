import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Generate JWT token
 * - Includes role for RBAC
 */
const signToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role, // 🔐 RBAC
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  console.log("Register endpoint hit");
  console.log("Request body:", req.body);

  try {
    const { fullName, email, password, location, photo, skills } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (ROLE DEFAULTS TO USER)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      location,
      photo,
      skills,
    });

    // Generate token
    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role, // ✅ frontend needs this
        location: user.location,
        photo: user.photo,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  // Find user WITH passwordHash
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+passwordHash");

  // Check password
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = signToken(user);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role, // ✅ RBAC exposed
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @access  Protected
 */
export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

/**
 * @route   POST /api/auth/logout
 * @access  Protected
 */
export const logout = asyncHandler(async (req, res) => {
  // Stateless JWT → frontend deletes token
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
