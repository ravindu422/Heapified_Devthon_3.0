export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403);
    throw new Error("Admin access only");
  }
  next();
};
