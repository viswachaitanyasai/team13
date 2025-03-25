const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const studentAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

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

    req.student = student; // Attach student data to request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = studentAuthMiddleware;
