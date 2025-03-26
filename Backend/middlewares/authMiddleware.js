const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    if (decoded.role !== "teacher") {
      return res
        .status(403)
        .json({ error: "Access denied. Only teachers are allowed." });
    }

    const teacherExists = await Teacher.exists({ _id: decoded.id });

    if (!teacherExists) {
      return res
        .status(401)
        .json({ error: "Invalid token. Teacher not found." });
    }
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
