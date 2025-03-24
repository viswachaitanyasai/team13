const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRETKEY, {
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
    if (token) {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRETKEY
      );
      const student = await Student.findById(decoded.id).select("-password");

      if (!student) {
        return res
          .status(401)
          .json({ error: "Invalid token. Student not found." });
      }

      req.student = student;

      if (!hackathon) {
        return res.status(404).json({ error: "Hackathon not found" });
      }
      const hasJoined = hackathon.participants.includes(req.student.id);
      const hasSubmitted = await Submission.exists({
        student: req.student.id,
        hackathon: id,
      });
    } else {
      const hasJoined = false;
      const hasSubmitted = false;
    }

    res.json({
      ...hackathon.toObject(),
      hasJoined,
      hasSubmitted,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
