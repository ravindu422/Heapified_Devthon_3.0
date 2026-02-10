import ContactAvailability from "../models/ContactAvailability.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @route   POST /api/contact-availability
 * @access  Public (for now, can be made protected later)
 */
export const createContactAvailability = async (req, res) => {
  try {
    const { 
      userId, 
      availability, 
      emergencyContact 
    } = req.body;

    console.log("Contact availability submission:", req.body);

    // Validation
    if (!userId || !availability || !emergencyContact) {
      return res.status(400).json({
        success: false,
        message: "userId, availability, and emergencyContact are required"
      });
    }

    if (!availability.date || !availability.time) {
      return res.status(400).json({
        success: false,
        message: "Availability date and time are required"
      });
    }

    if (!emergencyContact.name || !emergencyContact.relationship || !emergencyContact.phone) {
      return res.status(400).json({
        success: false,
        message: "All emergency contact fields are required"
      });
    }

    // Create contact availability record
    const contactAvailability = await ContactAvailability.create({
      userId,
      availability: {
        date: new Date(availability.date),
        time: availability.time,
        notes: availability.notes || "",
      },
      emergencyContact,
    });

    res.status(201).json({
      success: true,
      message: "Contact and availability information saved successfully!",
      data: contactAvailability,
    });
  } catch (error) {
    console.error("Error in createContactAvailability:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
    });
  }
};
