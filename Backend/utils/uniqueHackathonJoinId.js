const Hackathon = require("../models/Hackathon");

const generateInviteCode = async () => {
  let inviteCode;
  let isDuplicate = true;

  while (isDuplicate) {
    inviteCode = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();
    const existingHackathon = await Hackathon.findOne({
      invite_code: inviteCode,
    });
    if (!existingHackathon) isDuplicate = false; // Ensure it's unique
  }

  return inviteCode;
};

module.exports = { generateInviteCode };
