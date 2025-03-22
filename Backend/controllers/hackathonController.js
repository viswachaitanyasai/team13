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
      grade, // Grade restriction (e.g., "10th", "UG")
      judging_parameters,
    } = req.body;

    const validGrades = [
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

    // Validate required fields
    if (!title || !description || !start_date || !end_date || !grade) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    // Validate grade
    if (!validGrades.includes(grade)) {
      return res.status(400).json({ error: "Invalid grade level specified." });
    }

    // Convert is_public & allow_multiple_solutions to Boolean
    const isPublicBool = is_public === "true" || is_public === true;
    const allowMultipleBool =
      allow_multiple_solutions === "true" || allow_multiple_solutions === true;

    // Convert start_date & end_date to Date objects
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Ensure sponsors is an array
    const sponsorsArray =
      typeof sponsors === "string"
        ? sponsors.split(",").map((s) => s.trim())
        : sponsors;

    // Hash passkey if hackathon is private
    let hashedPasskey = null;
    if (!isPublicBool) {
      if (!passkey) {
        return res
          .status(400)
          .json({ error: "Passkey is required for private hackathons" });
      }
      hashedPasskey = await bcrypt.hash(passkey, 10);
    }

    // Generate unique invite code
    const inviteCode = await generateInviteCode();

    // Create Hackathon first
    const hackathon = await Hackathon.create({
      teacher_id: req.user.id,
      title,
      description,
      image_url,
      file_attachment_url,
      start_date: startDateObj,
      end_date: endDateObj,
      sponsors: sponsorsArray,
      allow_multiple_solutions: allowMultipleBool,
      is_public: isPublicBool,
      passkey: hashedPasskey, // Store hashed passkey
      invite_code: inviteCode, // Store unique invite code
      grade, // Store grade restriction
    });

    // Create judging parameters and store their IDs
    let judgingParameterIds = [];
    if (Array.isArray(judging_parameters) && judging_parameters.length > 0) {
      const createdParams = await JudgingParameter.insertMany(
        judging_parameters.map((param) => ({
          hackathon_id: hackathon._id,
          name: param.name,
          weightage: param.weightage,
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
    let {
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
    } = req.body;

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

    // Convert `is_public` and `allow_multiple_solutions` to Boolean
    is_public = is_public === "true" || is_public === true;
    allow_multiple_solutions =
      allow_multiple_solutions === "true" || allow_multiple_solutions === true;

    // Validate new judging parameters if provided
    // if (judging_parameters && judging_parameters.length > 0) {
    //   const validParams = await JudgingParameter.find({
    //     _id: { $in: judging_parameters },
    //   });
    //   if (validParams.length !== judging_parameters.length) {
    //     return res
    //       .status(400)
    //       .json({ error: "Invalid judging parameter ID(s) provided" });
    //   }
    // }

    // Validate start_date and end_date if provided
    if (start_date) {
      start_date = new Date(start_date);
      if (isNaN(start_date)) {
        return res.status(400).json({ error: "Invalid start date format" });
      }
    }
    if (end_date) {
      end_date = new Date(end_date);
      if (isNaN(end_date)) {
        return res.status(400).json({ error: "Invalid end date format" });
      }
    }

    // Ensure sponsors is an array
    if (sponsors) {
      sponsors =
        typeof sponsors === "string"
          ? sponsors.split(",").map((s) => s.trim())
          : sponsors;
    }

    // Handle passkey updates correctly
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
      hashedPasskey = null; // Remove passkey if hackathon is now public
    }

    // Update hackathon details
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathon_id,
      {
        title,
        description,
        image_url,
        file_attachment_url,
        start_date,
        end_date,
        sponsors,
        allow_multiple_solutions,
        is_public,
        passkey: hashedPasskey,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    )
      .populate("judging_parameters")
      .select("-passkey"); // Exclude passkey from response

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




// const joinHackathon = async (req, res) => {
//   try {
//     const { invite_code, name, email } = req.body;

//     if (!invite_code || !name || !email) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           error: "Invite code, name, and email are required",
//         });
//     }

//     // Find the hackathon by invite code
//     const hackathon = await Hackathon.findOne({ invite_code });

//     if (!hackathon) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Invalid invite code" });
//     }

//     // Check if the student already exists
//     let student = await Student.findOne({ email });

//     // Check if student is already a participant
//     if (student) {
//       const isAlreadyParticipant = await Hackathon.exists({
//         _id: hackathon._id,
//         participants: { $in: [student._id] },
//       });

//       if (isAlreadyParticipant) {
//         return res
//           .status(400)
//           .json({ success: false, error: "You are already a participant" });
//       }
//     }

//     // If student does not exist, create a new entry
//     if (!student) {
//       student = await Student.create({
//         name,
//         email,
//         joined_hackathons: [hackathon._id],
//       });
//     } else {
//       // Add hackathon to student's joined list, preventing duplicates
//       await Student.updateOne(
//         { _id: student._id },
//         { $addToSet: { joined_hackathons: hackathon._id } }
//       );
//     }

//     // Add student to hackathon participants, preventing duplicates
//     await Hackathon.updateOne(
//       { _id: hackathon._id },
//       { $addToSet: { participants: student._id } }
//     );

//     res.json({
//       success: true,
//       message: "Joined hackathon successfully",
//       student,
//       hackathon,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };






module.exports = {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
  getHackathonsByTeacher,
  
};
