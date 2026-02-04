import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Unauthorized: Missing token");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.sub).select("-passwordHash");

    if (!user) {
      res.status(401);
      throw new Error("Unauthorized: User not found");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Unauthorized: Invalid token"));
  }
};
