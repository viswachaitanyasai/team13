const Hackathon = require("../models/Hackathon");
const JudgingParameter = require("../models/JudgingParameter");

// Create a new hackathon with judging parameters
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
      is_public,
      passkey,
      judging_parameters,
    } = req.body;

    // Validate required fields
    if (!title || !description || !start_date || !end_date) {
      return res.status(400).json({
        error: "Title, description, start date, and end date are required",
      });
    }

    // Validate judging parameters
    if (judging_parameters && judging_parameters.length > 0) {
      const validParams = await JudgingParameter.find({
        _id: { $in: judging_parameters },
      });
      if (validParams.length !== judging_parameters.length) {
        return res
          .status(400)
          .json({ error: "Invalid judging parameter ID(s)" });
      }
    }

    // Hash passkey if hackathon is private
    let hashedPasskey = null;
    if (!is_public) {
      if (!passkey) {
        return res
          .status(400)
          .json({ error: "Passkey is required for private hackathons" });
      }
      hashedPasskey = await bcrypt.hash(passkey, 10);
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
      is_public,
      passkey: hashedPasskey, // Store hashed passkey
      judging_parameters,
    });

    res
      .status(201)
      .json({ message: "Hackathon created successfully", hackathon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({
      teacher_id: req.user.id,
    })
      .populate("judging_parameters")
      .select("-passkey"); // Exclude passkey from response

    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get hackathon details by ID (with judging parameters populated)
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathon_id)
      .populate("judging_parameters")
      .select("-passkey"); // Exclude passkey from response

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a hackathon (Only the teacher who created it can update)
const editHackathon = async (req, res) => {
  try {
    const { hackathon_id } = req.params;
    const teacher_id = req.user.id;
    const { judging_parameters, is_public, passkey } = req.body;

    // Find the hackathon
    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Check if the logged-in teacher is the creator
    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own hackathon" });
    }

    // Validate new judging parameters if provided
    if (judging_parameters && judging_parameters.length > 0) {
      const validParams = await JudgingParameter.find({
        _id: { $in: judging_parameters },
      });
      if (validParams.length !== judging_parameters.length) {
        return res
          .status(400)
          .json({ error: "Invalid judging parameter ID(s) provided" });
      }
    }

    // Hash new passkey if hackathon is being made private or passkey is updated
    let hashedPasskey = hackathon.passkey; // Keep existing hashed passkey
    if (is_public === false && passkey) {
      hashedPasskey = await bcrypt.hash(passkey, 10);
    }

    // Update hackathon details
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathon_id,
      { ...req.body, passkey: hashedPasskey }, // Store hashed passkey if updated
      { new: true, runValidators: true }
    )
      .populate("judging_parameters")
      .select("-passkey"); // Exclude passkey from response

    res.json({ message: "Hackathon updated successfully", updatedHackathon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a hackathon (Only the teacher who created it can delete)
const removeHackathon = async (req, res) => {
  try {
    const { hackathon_id } = req.params;
    const teacher_id = req.user.id;

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

    // Delete all judging parameters linked to this hackathon
    await JudgingParameter.deleteMany({ hackathon_id });

    // Delete the hackathon
    await Hackathon.findByIdAndDelete(hackathon_id);

    res.json({
      message: "Hackathon and its judging parameters deleted successfully",
    });
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
