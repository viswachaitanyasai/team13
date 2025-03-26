const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Hackathon = require("../models/Hackathon");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
// @desc Register a new student
// @route POST /api/students/register
// @access Public
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, grade, district, state } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ error: "Student already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    student = new Student({
      name,
      email,
      password: hashedPassword,
      grade,
      district,
      state,
    });

    await student.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Login student
// @route POST /api/students/login
// @access Public
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: student._id,role:"student" }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

    res.json({
      token,
      student: {
        name: student.name,
        email: student.email,
        grade: student.grade,
        district: student.district,
        state: student.state,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Get student profile
// @route GET /api/students/profile
// @access Private (requires auth)
exports.getStudentProfile = async (req, res) => {
  try {
    res.json(req.student);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getMyHackathons = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).populate(
      "joined_hackathons"
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ hackathons: student.joined_hackathons });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header("Authorization");
    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    let hasJoined = false;
    let hasSubmitted = false;

    if (token) {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRETKEY
      );
      const student = await Student.findById(decoded.id).select("-password");
      console.log(hackathon.passkey);
      if (!student) {
        return res
          .status(401)
          .json({ error: "Invalid token. Student not found." });
      }

      req.student = student;
      hasJoined = hackathon.participants.includes(req.student.id);
      hasSubmitted = await Submission.exists({
        student_id: req.student.id,
        hackathon_id: id,
      });
    }

    const filteredHackathon = {
      _id: hackathon._id,
      teacher_id: hackathon.teacher_id,
      title: hackathon.title,
      problem_statement: hackathon.problem_statement,
      description: hackathon.description,
      context: hackathon.context,
      image_url: hackathon.image_url,
      file_attachment_url: hackathon.file_attachment_url,
      start_date: hackathon.start_date,
      end_date: hackathon.end_date,
      sponsors: hackathon.sponsors,
      allow_multiple_solutions: hackathon.allow_multiple_solutions,
      is_public: hackathon.is_public,
      invite_code: hackathon.invite_code,
      grade: hackathon.grade,
      status: hackathon.status,
      isResultPublished: hackathon.isResultPublished,
      no_of_participants: hackathon.participants.length,
      created_at: hackathon.created_at,
      updated_at: hackathon.updated_at,
      hasJoined,
      hasSubmitted,
    };

    res.json(filteredHackathon);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPublicHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ is_public: true });
    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.joinHackathon = async (req, res) => {
  try {
    const { invite_code, passkey } = req.body;

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
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ error: "Missing HackathonId" });
    }
    const studentId = req.student.id;
    console.log(req.student);
    const submission = await Submission.findOne({
      student_id: studentId,
      hackathon_id: id,
    });

    if (!submission) {
      return res
        .status(404)
        .json({ error: "No submission found for this hackathon" });
    }

    // Find the evaluation based on submission_id
    const evaluation = await Evaluation.findOne({
      submission_id: submission._id,
    });

    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    res.json(evaluation);
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
