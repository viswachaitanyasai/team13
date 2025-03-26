const Hackathon = require("../models/Hackathon");
const Student = require("../models/Student");
const Submission = require("../models/Submission");
const JudgingParameter = require("../models/JudgingParameter");
const { generateInviteCode } = require("../utils/uniqueHackathonJoinId");
const {
  summarizeSkillGaps,
  summarizeSolutionKeywords,
} = require("../utils/test");
const bcrypt = require("bcrypt");
const Evaluation = require("../models/Evaluation");

// Create a new hackathon with judging parameters
const createHackathon = async (req, res) => {
  try {
    const {
      title,
      problem_statement,
      description,
      context,
      image_url,
      file_attachment_url,
      start_date,
      end_date,
      sponsors,
      allow_multiple_solutions,
      is_public,
      passkey,
      grade,
      judging_parameters, // Now an array of names
      custom_prompt,
    } = req.body;

    const validGrades = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
      "UG",
      "PG",
    ];

    if (
      !title ||
      !problem_statement ||
      !description ||
      !context ||
      !start_date ||
      !end_date ||
      !grade
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    if (!validGrades.includes(grade)) {
      return res.status(400).json({ error: "Invalid grade level specified." });
    }

    const isPublicBool = is_public === "true" || is_public === true;
    const allowMultipleBool =
      allow_multiple_solutions === "true" || allow_multiple_solutions === true;

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const sponsorsArray =
      typeof sponsors === "string"
        ? sponsors.split(",").map((s) => s.trim())
        : sponsors;

    let hashedPasskey = null;
    if (!isPublicBool) {
      if (!passkey) {
        return res
          .status(400)
          .json({ error: "Passkey is required for private hackathons" });
      }
      hashedPasskey = await bcrypt.hash(passkey, 10);
    }

    const inviteCode = await generateInviteCode();

    // ✅ Create the hackathon with an empty submissions array
    const hackathon = await Hackathon.create({
      teacher_id: req.user.id,
      title,
      problem_statement,
      description,
      context,
      image_url,
      file_attachment_url,
      start_date: startDateObj,
      end_date: endDateObj,
      sponsors: sponsorsArray,
      allow_multiple_solutions: allowMultipleBool,
      is_public: isPublicBool,
      passkey: hashedPasskey,
      invite_code: inviteCode,
      grade,
      status: "upcoming",
      isResultPublished: false,
      custom_prompt,
      participants: [],
      submissions: [], // ✅ Initialize submissions as an empty array
    });

    // ✅ Insert Judging Parameters (Only store name and hackathon_id)
    let judgingParameterIds = [];
    if (Array.isArray(judging_parameters) && judging_parameters.length > 0) {
      const createdParams = await JudgingParameter.insertMany(
        judging_parameters.map((name) => ({
          hackathon_id: hackathon._id,
          name,
        }))
      );
      judgingParameterIds = createdParams.map((param) => param._id);
    }

    // ✅ Update the hackathon with judging parameter IDs
    hackathon.judging_parameters = judgingParameterIds;
    await hackathon.save();

    // ✅ Populate judging_parameters before sending response
    const populatedHackathon = await Hackathon.findById(hackathon._id).populate(
      "judging_parameters"
    );

    res.status(201).json({
      message: "Hackathon created successfully",
      hackathon: populatedHackathon,
    });
  } catch (error) {
    console.error("Error creating hackathon:", error);
    res.status(400).json({ error: error.message });
  }
};

const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ teacher_id: req.user.id })
      .populate("judging_parameters")
      .populate("participants", "name email") // Fetch participant name & email
      .select("-passkey"); // Exclude passkey from response

    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get hackathon details by ID (with judging parameters populated)
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathon_id) // Use findById
      .populate("judging_parameters")
      .populate("participants", "name email") // Fetch participant name & email
      .select("-passkey");

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a hackathon (Only the teacher who created it can update)
const editHackathon = async (req, res) => {
  try {
    const { hackathon_id } = req.params;
    const teacher_id = req.user.id;
    let {
      title,
      problem_statement,
      description,
      context,
      image_url,
      file_attachment_url,
      start_date,
      end_date,
      sponsors,
      allow_multiple_solutions,
      is_public,
      passkey,
      grade,
      custom_prompt,
      judging_parameters, // Now only an array of names
    } = req.body;

    const validGrades = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
      "UG",
      "PG",
    ];

    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own hackathon" });
    }

    is_public = is_public === "true" || is_public === true;
    allow_multiple_solutions =
      allow_multiple_solutions === "true" || allow_multiple_solutions === true;

    if (start_date) {
      start_date = new Date(start_date);
      if (isNaN(start_date))
        return res.status(400).json({ error: "Invalid start date format" });
    }
    if (end_date) {
      end_date = new Date(end_date);
      if (isNaN(end_date))
        return res.status(400).json({ error: "Invalid end date format" });
    }

    if (grade && !validGrades.includes(grade)) {
      return res.status(400).json({ error: "Invalid grade level specified." });
    }

    if (sponsors) {
      sponsors =
        typeof sponsors === "string"
          ? sponsors.split(",").map((s) => s.trim())
          : sponsors;
    }

    let hashedPasskey = hackathon.passkey;
    if (is_public === false) {
      if (passkey) {
        hashedPasskey = await bcrypt.hash(passkey, 10);
      } else if (!hackathon.passkey) {
        return res
          .status(400)
          .json({ error: "Passkey is required for private hackathons" });
      }
    } else {
      hashedPasskey = null;
    }

    // Update hackathon details
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathon_id,
      {
        title,
        problem_statement,
        description,
        context,
        image_url,
        file_attachment_url,
        start_date,
        end_date,
        sponsors,
        allow_multiple_solutions,
        is_public,
        passkey: hashedPasskey,
        grade,
        custom_prompt,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    ).select("-passkey"); // Exclude passkey from response

    // Update Judging Parameters
    if (Array.isArray(judging_parameters)) {
      await JudgingParameter.deleteMany({ hackathon_id: hackathon._id });

      const newParams = await JudgingParameter.insertMany(
        judging_parameters.map((name) => ({
          hackathon_id: hackathon._id,
          name,
        }))
      );

      updatedHackathon.judging_parameters = newParams.map((param) => param._id);
      await updatedHackathon.save();
    }

    res.json({ message: "Hackathon updated successfully", updatedHackathon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHackathonsByTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;

    // Ensure the authenticated user is the same as the requested teacher
    if (req.user.id !== teacher_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const hackathons = await Hackathon.find({ teacher_id })
      .populate("judging_parameters")
      .populate("participants", "name email") // Fetch participant name & email
      .populate({
        path: "submissions",
        populate: { path: "student_id", select: "name email" }, // Fetch submission details
      })
      .select("-passkey"); // Exclude passkey from response

    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a hackathon (Only the teacher who created it can delete)
const removeHackathon = async (req, res) => {
  try {
    const { hackathon_id } = req.params;
    const teacher_id = req.user.id;

    // Find the hackathon
    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, error: "Hackathon not found" });
    }

    // Check if the logged-in teacher is the creator
    if (hackathon.teacher_id.toString() !== teacher_id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You can only delete your own hackathon",
      });
    }

    // Remove hackathon from students' joined_hackathons
    await Student.updateMany(
      { joined_hackathons: hackathon_id },
      { $pull: { joined_hackathons: hackathon_id } }
    );

    // Remove all linked judging parameters
    await JudgingParameter.deleteMany({ hackathon_id });

    // ✅ Remove all linked submissions
    await Submission.deleteMany({ hackathon_id });

    // Delete the hackathon
    await Hackathon.deleteOne({ _id: hackathon_id });

    res.json({
      success: true,
      message: "Hackathon and its related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get registrations for a specific hackathon
const getHackathonRegistrations = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    const hackathon = await Hackathon.findById(hackathon_id).populate(
      "participants",
      "name email"
    );

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json({ participants: hackathon.participants });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get submissions for a specific hackathon
const getHackathonSubmissions = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    const hackathon = await Hackathon.findById(hackathon_id).populate(
      "submissions"
    );

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json({ submissions: hackathon.submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHackathonEvaluations = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    // 1. Fetch the hackathon with its `submissions` and `participants` fields
    const hackathon = await Hackathon.findById(hackathon_id).populate({
      path: "submissions",
      populate: [
        { path: "evaluation_id" }, // Populate the entire evaluation object
        { path: "student_id", select: "name grade" }, // Fetch student details
      ],
    });
    
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // 2. Optional: Verify teacher authorization
    if (hackathon.teacher_id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // 3. Filter out only evaluated submissions (evaluation_id is not null)
    const evaluatedSubmissions = hackathon.submissions.filter(
      (sub) => sub.evaluation_id
    );
    // 4. Map the required fields and calculate total score
    let totalScore = 0;
    const evaluations = evaluatedSubmissions
      .map((sub) => {
        const score = sub.evaluation_id?.overall_score || 0;
        totalScore += score;
        return {
          studentName: sub.student_id?.name || "N/A",
          grade: sub.student_id?.grade || "N/A",
          overall_score: score,
          evaluation_category: sub.evaluation_id?.evaluation_category || "N/A",
          evaluation_id: sub?.evaluation_id._id,
        };
      })
      .sort((a, b) => b.overall_score - a.overall_score); // Sort by highest score first

    // 5. Calculate the average score
    const averageScore =
      evaluations.length > 0
        ? Math.round((totalScore / evaluations.length) * 100) / 100
        : 0; // Round to 2 decimal places

    // 6. Send total participants and total submissions
    res.status(200).json({
      totalParticipants: hackathon.participants.length,
      totalSubmissions: hackathon.submissions.length,
      evaluations,
      averageScore,
    });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    res.status(500).json({ error: error.message });
  }
};
const getEvaluationById = async (req, res) => {
  try {
    const { evaluation_id } = req.params;
    if (!evaluation_id) {
      return res.status(400).json({
        success: false,
        error: "Evaluation ID is required",
      });
    }

    // Find the evaluation by ID
    const evaluation = await Evaluation.findById(evaluation_id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: "Evaluation not found",
      });
    }

    // Find the submission linked to this evaluation and populate student details
    const submission = await Submission.findById(evaluation.submission_id).populate("student_id");

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found for this evaluation",
      });
    }

    res.json({
      success: true,
      data: {
        evaluation: evaluation.toObject(),  // Includes student_id (populated)
        student: submission?.student_id, // Populated student details
        submissionUrl:submission?.submission_url
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getHackathonSummary = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    await getHackathonEvaluationSummary(hackathon_id);

    // Fetch hackathon details with necessary fields populated
    const hackathon = await Hackathon.findById(hackathon_id)
      .populate({
        path: "judging_parameters",
        select: "name", // Fetch only the name field of judging parameters
      })
      .select(
        "title status judging_parameters is_result_published participants submissions shortlisted_students revisit_students rejected_students summary_analysis skill_gap_analysis"
      );

    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Construct response
    const summary = {
      id: hackathon_id,
      title: hackathon.title,
      status: hackathon.status,
      judging_parameters: hackathon.judging_parameters.map(
        (param) => param.name
      ),
      is_result_published: hackathon.is_result_published,
      number_of_participants: hackathon.participants.length,
      number_of_submissions: hackathon.submissions.length,
      number_of_shortlisted_students: hackathon.shortlisted_students.length,
      number_of_revisit_students: hackathon.revisit_students.length,
      number_of_rejected_students: hackathon.rejected_students.length,
      summary_analysis: hackathon.summary_analysis,
      skill_gap_analysis: hackathon.skill_gap_analysis,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching hackathon summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getHackathonEvaluationSummary = async (hackathon_id) => {
  try {
    const hackathon = await Hackathon.findById(hackathon_id);
    // console.log(hackathon.skill_gap);

    if (!hackathon) {
      throw new Error("Hackathon not found");
    }

    const problem_statement = hackathon.problem_statement;
    // console.log(hackathon.skill_gap);
    const skillGapArray = Object.entries(hackathon.skill_gap || {});
    const keywordsArray = Object.entries(hackathon.keywords || {}); // Convert object to Map

    // console.log(skillGapArray);
    const skillGapSummary = await summarizeSkillGaps(skillGapArray, problem_statement);
    const solutionSummary = await summarizeSolutionKeywords(keywordsArray, problem_statement);

    hackathon.skill_gap_analysis = skillGapSummary;
    hackathon.summary_analysis = solutionSummary;

    await hackathon.save();

    return;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const isResultPublished = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    // Find the hackathon
    const hackathon = await Hackathon.findById(hackathon_id).select(
      "is_result_published"
    );

    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, error: "Hackathon not found" });
    }

    res.json({
      success: true,
      hackathon_id: hackathon._id,
      is_result_published: hackathon.is_result_published,
    });
  } catch (error) {
    console.error("Error checking result status:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const publishResult = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    // Find and update the hackathon
    const hackathon = await Hackathon.findByIdAndUpdate(
      hackathon_id,
      { is_result_published: true },
      { new: true } // Returns the updated document
    );

    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, error: "Hackathon not found" });
    }

    // Check if update was successful
    if (!hackathon.is_result_published) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to publish results" });
    }

    res.json({
      success: true,
      message: "Results published successfully",
      hackathon_id: hackathon._id,
      is_result_published: hackathon.is_result_published,
    });
  } catch (error) {
    console.error("Error publishing results:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
  getHackathonsByTeacher,
  getHackathonSubmissions,
  getHackathonRegistrations,
  getHackathonEvaluations,
  getEvaluationById,
  getHackathonSummary,
  isResultPublished,
  publishResult,
};
