const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Basic validation (keep frontend + backend consistent)
  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("fullName, email, password are required");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash
  });

  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = signToken(user._id);

  res.json({
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email }
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

exports.logout = asyncHandler(async (req, res) => {
  // For JWT in localStorage: logout is frontend-side (delete token).
  // If you later use cookies/refresh tokens, implement server invalidation here.
  res.json({ message: "Logged out" });
});
