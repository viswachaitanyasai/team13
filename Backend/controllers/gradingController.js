const Evaluation = require("../models/Evaluation");
const JudgingParameter = require("../models/JudgingParameter");

const gradeSubmission = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const parameters = await JudgingParameter.find({
      hackathon_id: req.body.hackathon_id,
    });

    let evaluations = [];
    parameters.forEach((param) => {
      const score = Math.random() * 10; // Replace with actual AI logic
      evaluations.push({
        submission_id,
        parameter_id: param._id,
        score_numeric: score,
      });
    });

    await Evaluation.insertMany(evaluations);
    res
      .status(200)
      .json({ message: "Submission graded successfully", evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { gradeSubmission };
