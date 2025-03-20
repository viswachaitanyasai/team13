const mongoose = require("mongoose");

const JudgingParameterSchema = new mongoose.Schema({
  hackathon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon" },
  name: String,
  weightage: Number, // Should sum to 100 across parameters
  grade: {
    type:String,
    enum: ["low", "mid", "high"],
    default: "mid",
  },
});

module.exports = mongoose.model("JudgingParameter", JudgingParameterSchema);
