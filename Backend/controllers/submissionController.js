const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { extractText } = require("../utils/textExtractor");
const { analyzeText, analyzeAudio } = require("../utils/geminiAnalysis");
const { extractAudioFromVideo } = require("../utils/videoProcessor");
const { uploadFileToS3 } = require("../utils/s3Uploader");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const Hackathon = require("../models/Hackathon");

// ✅ Process File (Extract Text / Convert Audio)
const processFile = async (
  filePath,
  fileType,
  problemStatement,
  judgement_parameters,
  custom_prompt
) => {
  if (fileType.startsWith("audio/")) {
    return {
      evaluationResult: await analyzeAudio(
        problemStatement,
        judgement_parameters,
        filePath,
        custom_prompt
      ),
    };
  }
  if (fileType.startsWith("video/")) {
    const audioPath = await extractAudioFromVideo(filePath);
    return {
      evaluationResult: await analyzeAudio(
        problemStatement,
        judgement_parameters,
        audioPath,
        custom_prompt
      ),
    };
  }

  // ✅ Extract Text for Text-Based Files
  const extractedText = await extractText(filePath, fileType);
  const evaluationResult = await analyzeText(extractedText);
  return { evaluationResult };
};
// console.log("Starting");
// ✅ Save File Locally
const saveFileLocally = async (fileBuffer, fileName) => {
  const uploadDir = path.join(__dirname, "..", "uploads");

  try {
    await fsPromises.access(uploadDir); // Check if directory exists
  } catch (error) {
    await fsPromises.mkdir(uploadDir, { recursive: true }); // Create if not exists
  }

  const filePath = path.join(uploadDir, fileName);
  await fsPromises.writeFile(filePath, fileBuffer);
  return filePath;
};

const submitSolution = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { hackathon_id } = req.body;
    const student_id = req.student.id;

    if (!hackathon_id) {
      return res.status(400).json({ error: "Hackathon ID is required." });
    }

    if (!student_id) {
      return res.status(400).json({ error: "Student ID is required." });
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const originalFileName = req.file.originalname;

    // ✅ Save file locally with submission ID
    const fileExtension = path.extname(originalFileName);
    const fileName = `${hackathon_id}${student_id}${fileExtension}`;
    const tempFilePath = await saveFileLocally(fileBuffer, fileName);

    // ✅ Upload file to S3
    // console.log("uploading to s3");
    const fileUrl = await uploadFileToS3(
      fileBuffer,
      `uploads/${fileName}`,
      fileType
    );

    // ✅ Create Submission Entry First
    const submission = new Submission({
      hackathon_id,
      student_id,
      submission_url: fileUrl, // Will be updated after S3 upload
    });

    // ✅ Update Submission with uploaded file
    await submission.save();
    // Add submission to Hackathon's submissions array
    await Hackathon.findByIdAndUpdate(
      hackathon_id,
      {
        $push: { submissions: submission._id },
        $addToSet: { participants: student_id }, // Ensures unique student IDs
      },
      { new: true }
    );

    res.status(200).json({
      message: "Submission recorded successfully",
    });
    // console.log("submission saved");
    // ✅ Fetch Hackathon details
    const hackathon = await Hackathon.findById(hackathon_id);
    const problemStatement = `Title: ${hackathon.title}\nDescription: ${hackathon.description}\nProblem Statement: ${hackathon.problem_statement}\nContext: ${hackathon.context}`;
    const judgement_parameters = hackathon.judging_parameters;
    const custom_prompt = hackathon.custom_prompt;

    // Declare evaluationResult in the outer scope
    let evaluationResult;

    // ✅ **Process File for Evaluation**
    try {
      // Process File for Evaluation
      const result = await processFile(
        tempFilePath,
        fileType,
        problemStatement,
        judgement_parameters,
        custom_prompt
      );
      // console.log("file processed and evaluated");
      // Destructure and assign to evaluationResult
      const { evaluationResult: evalRes } = result;
      // console.log("Type of evaluationResult:", typeof evalRes);
      // JSON.parse(evalRes);

      evaluationResult = evalRes;
      // console.log("Evaluation Result1:", evaluationResult);

      // ✅ Create Evaluation Entry with the exact return structure and update status to "completed"
      const evaluation = new Evaluation({
        submission_id: submission._id,
        evaluation_status: "completed", // set status to completed
        evaluation_category:
          evaluationResult.overall_score < 4
            ? "rejected"
            : evaluationResult.overall_score < 7
            ? "revisit"
            : "shortlisted",
        parameter_feedback: evaluationResult.parameter_feedback,
        improvement: evaluationResult.improvement,
        actionable_steps: evaluationResult.actionable_steps,
        strengths: evaluationResult.strengths,
        overall_score: evaluationResult.overall_score,
        overall_reason: evaluationResult.overall_reason,
        summary: evaluationResult.summary,
      });


      await evaluation.save();
      // console.log(evaluation);
      // ✅ Link Submission with Evaluation
      submission.evaluation_id = evaluation._id;
      await submission.save();
    } finally {
      // ✅ Delete temporary file in all cases
      await fsPromises
        .unlink(tempFilePath)
        .catch((err) => console.error("File deletion error:", err));
    }

    // Send a structured response including evaluation details
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ error: "Error processing submission" });
  }
};

const updateEvaluationCategory = async (req, res) => {
  try {
    const { submission_id } = req.params; // Get submission ID from request params
    const { evaluation_category } = req.body; // Get new category from request body

    // Validate category input
    const validCategories = ["shortlisted", "revisit", "rejected"];
    if (!validCategories.includes(evaluation_category)) {
      return res.status(400).json({ error: "Invalid evaluation category" });
    }

    // Find the submission to check if it has an evaluation
    const submission = await Submission.findById(submission_id).populate(
      "evaluation_id"
    );

    if (!submission || !submission.evaluation_id) {
      return res
        .status(404)
        .json({ error: "Evaluation not found for this submission" });
    }

    // Update the evaluation category
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      submission.evaluation_id._id,
      { evaluation_category },
      { new: true }
    );

    res.status(200).json({
      message: "Evaluation category updated successfully",
      updatedEvaluation,
    });
  } catch (error) {
    console.error("Error updating evaluation category:", error);
    res.status(500).json({ error: error.message });
  }
};
const bulkUpdateEvaluationCategory = async (req, res) => {
  try {
    const { hackathon_id } = req.params;

    // Find the hackathon to ensure it exists
    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Get all submissions linked to the hackathon
    const submissions = await Submission.find({
      _id: { $in: hackathon.submissions }, // Use stored submission IDs in Hackathon
      evaluation_id: { $ne: null }, // Ensure evaluation exists
    }).populate("evaluation_id");

    // Filter only those evaluations where category is "revisit"
    const evaluationsToUpdate = submissions
      .map((sub) => sub.evaluation_id)
      .filter((eval) => eval.evaluation_category === "revisit");

    if (evaluationsToUpdate.length === 0) {
      return res.status(200).json({ message: "No evaluations need updating." });
    }

    // Update all evaluations in bulk
    await Evaluation.updateMany(
      { _id: { $in: evaluationsToUpdate.map((e) => e._id) } },
      { $set: { evaluation_category: "rejected" } }
    );

    res.status(200).json({
      message: "Successfully updated all 'revisit' evaluations to 'rejected'.",
      updatedCount: evaluationsToUpdate.length,
    });
  } catch (error) {
    console.error("Error updating evaluations:", error);
    res.status(500).json({ error: error.message });
  }
};
const editEvaluationScore = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const { new_score } = req.body;

    // Validate new_score (Ensure it's a number between 0 and 10)
    if (typeof new_score !== "number" || new_score < 0 || new_score > 10) {
      return res
        .status(400)
        .json({ error: "Invalid score. Must be between 0 and 10." });
    }

    // Find the submission and ensure it has an evaluation
    const submission = await Submission.findById(submission_id).populate(
      "evaluation_id"
    );
    if (!submission || !submission.evaluation_id) {
      return res
        .status(404)
        .json({ error: "Submission or evaluation not found." });
    }

    // Update the evaluation score
    submission.evaluation_id.overall_score = new_score;

    // Update the evaluation category based on the new score
    if (new_score < 4) {
      submission.evaluation_id.evaluation_category = "rejected";
    } else if (new_score < 7) {
      submission.evaluation_id.evaluation_category = "revisit";
    } else {
      submission.evaluation_id.evaluation_category = "shortlisted";
    }

    // Save the updated evaluation
    await submission.evaluation_id.save();

    res.status(200).json({
      message: "Evaluation score updated successfully.",
      overall_score: submission.evaluation_id.overall_score,
      evaluation_category: submission.evaluation_id.evaluation_category,
    });
  } catch (error) {
    console.error("Error updating evaluation score:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { submitSolution, updateEvaluationCategory,bulkUpdateEvaluationCategory,editEvaluationScore };
