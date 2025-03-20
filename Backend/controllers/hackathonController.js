const Hackathon = require("../models/Hackathon");

// Create a new hackathon
const createHackathon = async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      file_attachment_url,
      start_date,
      end_date,
      sponsors,
      allow_multiple_solutions,
    } = req.body;

    // Validate required fields
    if (!title || !description || !start_date || !end_date) {
      return res
        .status(400)
        .json({
          error: "Title, description, start date, and end date are required",
        });
    }

    const hackathon = await Hackathon.create({
      teacher_id: req.user.id,
      title,
      description,
      image_url,
      file_attachment_url,
      start_date,
      end_date,
      sponsors,
      allow_multiple_solutions,
    });

    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all hackathons created by a teacher
const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ teacher_id: req.user.id });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get hackathon details by ID
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editHackathon = async (req, res) => {
  try {
    const { hackathon_id } = req.params;
    const teacher_id = req.user.id; // Get teacher ID from authenticated user

    // Find the hackathon
    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Check if the logged-in teacher is the creator of the hackathon
    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own hackathon" });
    }

    // Update hackathon details
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathon_id,
      req.body, // Allow partial updates
      { new: true, runValidators: true } // Return updated document & enforce schema rules
    );

    res.json({ message: "Hackathon updated successfully", updatedHackathon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeHackathon = async (req, res) => {
  try {
    const { hackathon_id } = req.params;
    const teacher_id = req.user.id; // Get logged-in teacher ID

    // Find the hackathon
    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Check if the logged-in teacher is the creator
    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res
        .status(403)
        .json({
          error: "Unauthorized: You can only delete your own hackathon",
        });
    }

    // Delete the hackathon
    await Hackathon.findByIdAndDelete(hackathon_id);

    res.json({ message: "Hackathon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
};
