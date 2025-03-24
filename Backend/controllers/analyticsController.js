const Hackathon = require("../models/Hackathon");
const Student = require("../models/Student");
const Submission = require("../models/Submission"); // Assuming there's a Submission model
const mongoose = require("mongoose");

// 📌 1️⃣ Get Hackathon Statistics (Counts of Ongoing, Upcoming, Completed)
const getHackathonStats = async (req, res) => {
  try {
    const teacher_id = req.user.id;

    const statusCounts = await Hackathon.aggregate([
      { $match: { teacher_id: new mongoose.Types.ObjectId(teacher_id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      upcoming: 0,
      ongoing: 0,
      completed: 0,
    };

    statusCounts.forEach(({ _id, count }) => {
      stats[_id] = count;
    });

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getStudentRegistrations = async (req, res) => {
  try {
    const teacher_id = req.user.id;

    const timeFrames = {
      week: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      year: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    };

    const registrationCounts = await Hackathon.aggregate([
      { $match: { teacher_id: new mongoose.Types.ObjectId(teacher_id) } },
      { $unwind: "$participants" },
      {
        $lookup: {
          from: "students",
          localField: "participants",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" },
      {
        $group: {
          _id: {
            week: { $gte: ["$studentDetails.created_at", timeFrames.week] },
            month: { $gte: ["$studentDetails.created_at", timeFrames.month] },
            year: { $gte: ["$studentDetails.created_at", timeFrames.year] },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      week: 0,
      month: 0,
      year: 0,
    };

    registrationCounts.forEach(({ _id, count }) => {
      if (_id.week) stats.week += count;
      if (_id.month) stats.month += count;
      if (_id.year) stats.year += count;
    });

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 3️⃣ Get Submission Stats (Last 5 Hackathons)
const getSubmissionStats = async (req, res) => {
  try {
    const teacher_id = req.user.id;

    const recentHackathons = await Hackathon.find({ teacher_id })
      .sort({ created_at: -1 }) // Sort by latest created first
      .limit(5)
      .select("_id title participants");

    const hackathonIds = recentHackathons.map((h) => h._id);

    const submissionCounts = await Submission.aggregate([
      { $match: { hackathon_id: { $in: hackathonIds } } },
      { $group: { _id: "$hackathon_id", count: { $sum: 1 } } },
    ]);

    const submissionMap = submissionCounts.reduce((acc, cur) => {
      acc[cur._id.toString()] = cur.count;
      return acc;
    }, {});

    const stats = recentHackathons.map((hackathon) => ({
      title: hackathon.title,
      total_participants: hackathon.participants.length,
      total_submissions: submissionMap[hackathon._id.toString()] || 0,
      
    }));

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getHackathonStats,
  getStudentRegistrations,
  getSubmissionStats,
};
