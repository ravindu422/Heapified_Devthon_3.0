import express from "express";
import User from "../models/User.js";
import ContactAvailability from "../models/ContactAvailability.js";

const router = express.Router();

/**
 * @route   GET /api/admin/data
 * @access  Public (for development - should be protected in production)
 */
router.get("/data", async (req, res) => {
  try {
    // Get all users
    const users = await User.find({}).select('-passwordHash');
    
    // Get all contact availability records
    const contacts = await ContactAvailability.find({});

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          location: user.location,
          skills: user.skills,
          createdAt: user.createdAt
        })),
        contactAvailability: contacts.map(contact => ({
          id: contact._id,
          userId: contact.userId,
          availability: contact.availability,
          emergencyContact: contact.emergencyContact,
          createdAt: contact.createdAt
        })),
        summary: {
          totalUsers: users.length,
          totalContacts: contacts.length
        }
      }
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data"
    });
  }
});

export default router;
