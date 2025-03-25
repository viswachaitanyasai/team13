const Hackathon = require("../models/Hackathon");

const generateInviteCode = async () => {
  let inviteCode;
  let isDuplicate = true;

  while (isDuplicate) {
    inviteCode = Math.random().toString(36).substr(2, 5).toUpperCase(); // Generate 5-letter code
    const existingHackathon = await Hackathon.findOne({ invite_code: inviteCode });
    if (!existingHackathon) isDuplicate = false; // Ensure it's unique
  }


  return inviteCode;
};

module.exports = { generateInviteCode };
