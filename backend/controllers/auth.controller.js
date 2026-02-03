import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Generate JWT token
 */
const signToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * @route   POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("fullName, email, password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check existing user
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
  });

  // Generate token
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
});

/**
 * @route   POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  // Find user WITH passwordHash
  const user = await User
    .findOne({ email: email.toLowerCase() })
    .select("+passwordHash");

  // Password check
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = signToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
});


/**
 * @route   GET /api/auth/me
 * @access  Protected
 */
export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

/**
 * @route   POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // Stateless JWT → frontend deletes token
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
