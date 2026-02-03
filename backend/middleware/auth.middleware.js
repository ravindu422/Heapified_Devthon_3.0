const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Unauthorized: Missing token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub).select("-passwordHash");
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Unauthorized: Invalid token"));
  }
}

module.exports = { protect };
