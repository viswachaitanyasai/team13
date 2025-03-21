const Hackathon = require("../models/Hackathon");
const Student = require("../models/Student");
const JudgingParameter = require("../models/JudgingParameter");
const { generateInviteCode } = require("../utils/uniqueHackathonJoinId");
const bcrypt = require("bcrypt");



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
      judging_parameters, // [{ name: "Creativity", weightage: 40 }, { name: "Technicality", weightage: 60 }]
    } = req.body;

    // Validate required fields
    if (!title || !description || !start_date || !end_date) {
      return res.status(400).json({
        error: "Title, description, start date, and end date are required",
      });
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

    const inviteCode = await generateInviteCode(); // Generate a unique invite code

    // Create Hackathon first (to get its _id)
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
      invite_code: inviteCode, // Store unique invite code
    });

    // Create judging parameters and store their IDs
    let judgingParameterIds = [];
    if (judging_parameters && judging_parameters.length > 0) {
      const createdParams = await JudgingParameter.insertMany(
        judging_parameters.map((param) => ({
          hackathon_id: hackathon._id,
          name: param.name,
          weightage: param.weightage, // No restriction on total sum
        }))
      );
      judgingParameterIds = createdParams.map((param) => param._id);
    }

    // Update the hackathon with judging parameter IDs
    hackathon.judging_parameters = judgingParameterIds;
    await hackathon.save();

    res
      .status(201)
      .json({ message: "Hackathon created successfully", hackathon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ teacher_id: req.user.id })
      .populate("judging_parameters")
      .populate("participants", "name email") // Fetch participant name & email
      .select("-passkey"); // Exclude passkey from response

    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get hackathon details by ID (with judging parameters populated)
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathon_id) // Use findById
      .populate("judging_parameters")
      .populate("participants", "name email") // Fetch participant name & email
      .select("-passkey");

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
      return res
        .status(404)
        .json({ success: false, error: "Hackathon not found" });
    }

    // Check if the logged-in teacher is the creator
    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Unauthorized: You can only delete your own hackathon",
        });
    }

    // Remove hackathon reference from students
    await Student.updateMany(
      { joined_hackathons: hackathon._id },
      { $pull: { joined_hackathons: hackathon._id } }
    );

    // Remove all participants from hackathon before deletion
    await Hackathon.updateOne(
      { _id: hackathon_id },
      { $set: { participants: [] } }
    );

    // Delete all judging parameters linked to this hackathon
    await JudgingParameter.deleteMany({ hackathon_id });

    // Delete the hackathon
    await Hackathon.findByIdAndDelete(hackathon_id);

    res.json({
      success: true,
      message: "Hackathon and its judging parameters deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




const joinHackathon = async (req, res) => {
  try {
    const { invite_code, name, email } = req.body;

    if (!invite_code || !name || !email) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Invite code, name, and email are required",
        });
    }

    // Find the hackathon by invite code
    const hackathon = await Hackathon.findOne({ invite_code });

    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid invite code" });
    }

    // Check if the student already exists
    let student = await Student.findOne({ email });

    // Check if student is already a participant
    if (student) {
      const isAlreadyParticipant = await Hackathon.exists({
        _id: hackathon._id,
        participants: { $in: [student._id] },
      });

      if (isAlreadyParticipant) {
        return res
          .status(400)
          .json({ success: false, error: "You are already a participant" });
      }
    }

    // If student does not exist, create a new entry
    if (!student) {
      student = await Student.create({
        name,
        email,
        joined_hackathons: [hackathon._id],
      });
    } else {
      // Add hackathon to student's joined list, preventing duplicates
      await Student.updateOne(
        { _id: student._id },
        { $addToSet: { joined_hackathons: hackathon._id } }
      );
    }

    // Add student to hackathon participants, preventing duplicates
    await Hackathon.updateOne(
      { _id: hackathon._id },
      { $addToSet: { participants: student._id } }
    );

    res.json({
      success: true,
      message: "Joined hackathon successfully",
      student,
      hackathon,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};






module.exports = {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
  joinHackathon,
};
