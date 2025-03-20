const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRETKEY, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

module.exports = {generateToken};
