const mongoose = require("mongoose");

const JudgingParameterSchema = new mongoose.Schema({
  hackathon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon" },
  name: String,
});

module.exports = mongoose.model("JudgingParameter", JudgingParameterSchema);
