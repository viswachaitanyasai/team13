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
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, student: { name: student.name, email: student.email, grade: student.grade, district: student.district, state: student.state } });
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
