const Hackathon = require("../models/Hackathon");
const Student = require("../models/Student");
const Submission = require("../models/Submission");
const JudgingParameter = require("../models/JudgingParameter");
const { generateInviteCode } = require("../utils/uniqueHackathonJoinId");
const bcrypt = require("bcrypt");

// Create a new hackathon with judging parameters
const createHackathon = async (req, res) => {
  try {
    const {
      title,
      problem_statement,
      description,
      context,
      image_url,
      file_attachment_url,
      start_date,
      end_date,
      sponsors,
      allow_multiple_solutions,
      is_public,
      passkey,
      grade,
      judging_parameters, // Now an array of names
      custom_prompt,
    } = req.body;

    const validGrades = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
      "UG",
      "PG",
    ];

    if (
      !title ||
      !problem_statement ||
      !description ||
      !context ||
      !start_date ||
      !end_date ||
      !grade
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    if (!validGrades.includes(grade)) {
      return res.status(400).json({ error: "Invalid grade level specified." });
    }

    const isPublicBool = is_public === "true" || is_public === true;
    const allowMultipleBool =
      allow_multiple_solutions === "true" || allow_multiple_solutions === true;

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const sponsorsArray =
      typeof sponsors === "string"
        ? sponsors.split(",").map((s) => s.trim())
        : sponsors;

    let hashedPasskey = null;
    if (!isPublicBool) {
      if (!passkey) {
        return res
          .status(400)
          .json({ error: "Passkey is required for private hackathons" });
      }
      hashedPasskey = await bcrypt.hash(passkey, 10);
    }

    const inviteCode = await generateInviteCode();

    // ✅ Create the hackathon with an empty submissions array
    const hackathon = await Hackathon.create({
      teacher_id: req.user.id,
      title,
      problem_statement,
      description,
      context,
      image_url,
      file_attachment_url,
      start_date: startDateObj,
      end_date: endDateObj,
      sponsors: sponsorsArray,
      allow_multiple_solutions: allowMultipleBool,
      is_public: isPublicBool,
      passkey: hashedPasskey,
      invite_code: inviteCode,
      grade,
      status: "upcoming",
      isResultPublished: false,
      custom_prompt,
      participants: [],
      submissions: [], // ✅ Initialize submissions as an empty array
    });

    // ✅ Insert Judging Parameters (Only store name and hackathon_id)
    let judgingParameterIds = [];
    if (Array.isArray(judging_parameters) && judging_parameters.length > 0) {
      const createdParams = await JudgingParameter.insertMany(
        judging_parameters.map((name) => ({
          hackathon_id: hackathon._id,
          name,
        }))
      );
      judgingParameterIds = createdParams.map((param) => param._id);
    }

    // ✅ Update the hackathon with judging parameter IDs
    hackathon.judging_parameters = judgingParameterIds;
    await hackathon.save();

    res.status(201).json({
      message: "Hackathon created successfully",
      hackathon,
    });
  } catch (error) {
    console.error("Error creating hackathon:", error);
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
    let {
      title,
      problem_statement,
      description,
      context,
      image_url,
      file_attachment_url,
      start_date,
      end_date,
      sponsors,
      allow_multiple_solutions,
      is_public,
      passkey,
      grade,
      custom_prompt,
      judging_parameters, // Now only an array of names
    } = req.body;

    const validGrades = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
      "UG",
      "PG",
    ];

    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own hackathon" });
    }

    is_public = is_public === "true" || is_public === true;
    allow_multiple_solutions =
      allow_multiple_solutions === "true" || allow_multiple_solutions === true;

    if (start_date) {
      start_date = new Date(start_date);
      if (isNaN(start_date))
        return res.status(400).json({ error: "Invalid start date format" });
    }
    if (end_date) {
      end_date = new Date(end_date);
      if (isNaN(end_date))
        return res.status(400).json({ error: "Invalid end date format" });
    }

    if (grade && !validGrades.includes(grade)) {
      return res.status(400).json({ error: "Invalid grade level specified." });
    }

    if (sponsors) {
      sponsors =
        typeof sponsors === "string"
          ? sponsors.split(",").map((s) => s.trim())
          : sponsors;
    }

    let hashedPasskey = hackathon.passkey;
    if (is_public === false) {
      if (passkey) {
        hashedPasskey = await bcrypt.hash(passkey, 10);
      } else if (!hackathon.passkey) {
        return res
          .status(400)
          .json({ error: "Passkey is required for private hackathons" });
      }
    } else {
      hashedPasskey = null;
    }

    // Update hackathon details
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathon_id,
      {
        title,
        problem_statement,
        description,
        context,
        image_url,
        file_attachment_url,
        start_date,
        end_date,
        sponsors,
        allow_multiple_solutions,
        is_public,
        passkey: hashedPasskey,
        grade,
        custom_prompt,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    ).select("-passkey"); // Exclude passkey from response

    // Update Judging Parameters
    if (Array.isArray(judging_parameters)) {
      await JudgingParameter.deleteMany({ hackathon_id: hackathon._id });

      const newParams = await JudgingParameter.insertMany(
        judging_parameters.map((name) => ({
          hackathon_id: hackathon._id,
          name,
        }))
      );

      updatedHackathon.judging_parameters = newParams.map((param) => param._id);
      await updatedHackathon.save();
    }

    res.json({ message: "Hackathon updated successfully", updatedHackathon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHackathonsByTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;

    // Ensure the authenticated user is the same as the requested teacher
    if (req.user.id !== teacher_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const hackathons = await Hackathon.find({ teacher_id })
      .populate("judging_parameters")
      .populate("participants", "name email") // Fetch participant name & email
      .populate({
        path: "submissions",
        populate: { path: "student_id", select: "name email" }, // Fetch submission details
      })
      .select("-passkey"); // Exclude passkey from response

    res.json(hackathons);
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
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You can only delete your own hackathon",
      });
    }

    // Remove hackathon from students' joined_hackathons
    await Student.updateMany(
      { joined_hackathons: hackathon_id },
      { $pull: { joined_hackathons: hackathon_id } }
    );

    // Remove all linked judging parameters
    await JudgingParameter.deleteMany({ hackathon_id });

    // ✅ Remove all linked submissions
    await Submission.deleteMany({ hackathon_id });

    // Delete the hackathon
    await Hackathon.deleteOne({ _id: hackathon_id });

    res.json({
      success: true,
      message: "Hackathon and its related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Get registrations for a specific hackathon
const getHackathonRegistrations = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    const hackathon = await Hackathon.findById(hackathon_id).populate("participants", "name email");

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json({ participants: hackathon.participants });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get submissions for a specific hackathon
const getHackathonSubmissions = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    const hackathon = await Hackathon.findById(hackathon_id).populate(
      "submissions"
    );

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json({ submissions: hackathon.submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const joinHackathon = async (req, res) => {
  try {
    const { invite_code, name, email } = req.body;

    if (!invite_code) {
      return res
        .status(400)
        .json({ success: false, error: "Invite code is required" });
    }

    // Find the hackathon by invite code
    const hackathon = await Hackathon.findOne({ invite_code }).select(
      "passkey is_public participants"
    );

    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid invite code" });
    }

    // If the hackathon is private, verify the passkey
    if (!hackathon.is_public) {
      if (!passkey) {
        return res.status(400).json({
          success: false,
          error: "Passkey is required for private hackathons",
        });
      }

      const isMatch = await bcrypt.compare(passkey, hackathon.passkey); // Correct bcrypt comparison
      if (!isMatch) {
        return res
          .status(403)
          .json({ success: false, error: "Invalid passkey" });
      }
    }

    // Check if student is already a participant
    if (hackathon.participants.includes(req.student.id)) {
      return res
        .status(400)
        .json({ success: false, error: "You are already a participant" });
    }

    // Add student to hackathon participants
    await Hackathon.updateOne(
      { _id: hackathon._id },
      { $addToSet: { participants: req.student.id } }
    );

    // Add hackathon to student's joined list
    await Student.updateOne(
      { _id: req.student.id },
      { $addToSet: { joined_hackathons: hackathon._id } }
    );

    res.json({ success: true, message: "Joined hackathon successfully" });
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
  getHackathonsByTeacher,
  joinHackathon,
  getHackathonSubmissions,
  getHackathonRegistrations,
};
