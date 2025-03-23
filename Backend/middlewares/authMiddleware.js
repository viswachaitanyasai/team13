const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  console.log("Authorization Header:", req.header("Authorization"));

  const token =
    req.header("Authorization")?.split(" ")[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
