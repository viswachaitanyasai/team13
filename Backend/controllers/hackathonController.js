const Hackathon = require("../models/Hackathon");

const createHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.create({
      ...req.body,
      teacher_id: req.user.id,
    });
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ teacher_id: req.user.id });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathon_id);
    res.json(hackathon);
  } catch (error) {
    res.status(404).json({ error: "Hackathon not found" });
  }
};

module.exports = { createHackathon, getHackathons, getHackathonById };
