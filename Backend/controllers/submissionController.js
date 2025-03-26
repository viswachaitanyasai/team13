const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { extractText } = require("../utils/textExtractor");
const { analyzeText, analyzeAudio } = require("../utils/geminiAnalysis");
const { extractAudioFromVideo } = require("../utils/videoProcessor");
const { uploadFileToS3 } = require("../utils/s3Uploader");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const Student = require("../models/Student");
const Hackathon = require("../models/Hackathon");
const { updateHackathonData } = require("../utils/geminiAnalysis");
// ✅ Process File (Extract Text / Convert Audio)
const processFile = async (
  filePath,
  fileType,
  problemStatement,
  judgement_parameters,
  custom_prompt
) => {
  // console.log("File Path:", filePath);
  // console.log("File Type:", fileType);
  // console.log("Problem Statement:", problemStatement);
  // console.log("Judgement Parameters:", judgement_parameters);
  // console.log("Custom Prompt:", custom_prompt);

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
  // console.log("extractedText", extractedText);
  const evaluationResult = await analyzeText(
    problemStatement,
    judgement_parameters,
    extractedText,
    custom_prompt
  );
  console.log(evaluationResult);
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
    const hackathon = await Hackathon.findById(hackathon_id)
      .populate("judging_parameters", "name") // Populate only the 'name' field
      .exec();
    if (!hackathon)
      return res.status(404).json({ error: "Hackathon not found." });

    if (!student_id) {
      return res.status(400).json({ error: "Student ID is required." });
    }

    const student = await Student.findById(student_id);
    if (!student) return res.status(404).json({ error: "Student not found." });

    if (hackathon.is_result_published) {
      return res
        .status(400)
        .json({ error: "Sorry Submission deadline already over." });
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

    res.status(200).json({
      message: "Submission recorded successfully",
    });
    // console.log("submission saved");
    // ✅ Fetch Hackathon details
    const problemStatement = `Title: ${hackathon.title}\nDescription: ${hackathon.description}\nProblem Statement: ${hackathon.problem_statement}\nContext: ${hackathon.context}`;
    const judgement_parameters = hackathon.judging_parameters.map(
      (param) => param.name
    );
    const custom_prompt = hackathon.custom_prompt;
    // console.log(student_id);
    await Student.findByIdAndUpdate(student_id, {
      $push: { submissions: submission._id },
    });
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

      const max = evaluationResult.parameter_feedback.length * 2 || 0;
      // console.log(overall_score, typeof overall_score);
      const score = (evaluationResult.overall_score / max) * 10;

      // ✅ Create Evaluation Entry with the exact return structure and update status to "completed"
      const evaluation = new Evaluation({
        submission_id: submission._id,
        evaluation_status: "completed", // set status to completed
        evaluation_category:
          score < 4 ? "rejected" : score < 7 ? "revisit" : "shortlisted",
        parameter_feedback: evaluationResult.parameter_feedback,
        improvement: evaluationResult.improvement,
        actionable_steps: evaluationResult.actionable_steps,
        strengths: evaluationResult.strengths,
        overall_score: score,
        overall_reason: evaluationResult.overall_reason,
        summary: evaluationResult.summary,
      });

      await evaluation.save();

      let categoryField;
      if (evaluation.evaluation_category === "shortlisted") {
        categoryField = "shortlisted_students";
      } else if (evaluation.evaluation_category === "revisit") {
        categoryField = "revisit_students";
      } else {
        categoryField = "rejected_students";
      }

      // Add submission and student to the correct category
      await Hackathon.findByIdAndUpdate(
        hackathon_id,
        {
          $push: { submissions: submission._id, [categoryField]: student_id },
          $addToSet: { participants: student_id }, // Ensures the student is uniquely tracked
        },
        { new: true }
      );
      // console.log(evaluation);
      // ✅ Link Submission with Evaluation
      // console.log("in submit func", evaluationResult.keywords);
      await updateHackathonData(
        hackathon_id,
        evaluationResult.skill_gap,
        evaluationResult.keywords
      );
      submission.evaluation_id = evaluation._id;
      await submission.save();
    } finally {
      // ✅ Delete temporary file in all cases
      // await fsPromises
      //   .unlink(tempFilePath)
      //   .catch((err) => console.error("File deletion error:", err));
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

    // Find the submission along with its evaluation and hackathon
    const submission = await Submission.findById(submission_id)
      .populate("evaluation_id")
      .populate("hackathon_id")
      .populate("student_id");

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

    // Determine the correct student category
    let categoryField;
    if (evaluation_category === "shortlisted") {
      categoryField = "shortlisted_students";
    } else if (evaluation_category === "revisit") {
      categoryField = "revisit_students";
    } else {
      categoryField = "rejected_students";
    }

    // Remove the student from all category lists
    await Hackathon.findByIdAndUpdate(submission.hackathon_id._id, {
      $pull: {
        shortlisted_students: submission.student_id._id,
        revisit_students: submission.student_id._id,
        rejected_students: submission.student_id._id,
      },
    });

    // Add the student to the correct category
    await Hackathon.findByIdAndUpdate(submission.hackathon_id._id, {
      $push: { [categoryField]: submission.student_id._id },
    });

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

    // Ensure the hackathon exists
    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Fetch all submissions that belong to this hackathon and are marked as "revisit"
    const evaluations = await Evaluation.find({
      _id: { $in: hackathon.submissions },
      evaluation_category: "revisit",
    }).populate("submission_id");

    if (!evaluations.length) {
      return res.status(200).json({ message: "No evaluations to update." });
    }

    // Extract student IDs from the evaluations
    const studentIdsToReject = evaluations.map(
      (eval) => eval.submission_id.student_id
    );

    // Update the evaluation category from "revisit" to "rejected"
    const result = await Evaluation.updateMany(
      { _id: { $in: evaluations.map((eval) => eval._id) } },
      { $set: { evaluation_category: "rejected" } }
    );

    // Remove students from the "revisit_students" list and add them to "rejected_students"
    await Hackathon.findByIdAndUpdate(hackathon_id, {
      $pull: { revisit_students: { $in: studentIdsToReject } },
      $push: { rejected_students: { $each: studentIdsToReject } },
    });

    res.status(200).json({
      message: `Successfully updated ${result.modifiedCount} evaluations from 'revisit' to 'rejected'.`,
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating evaluations:", error);
    res.status(500).json({ error: error.message });
  }
};

const editEvaluationScore = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const new_score = Number(req.body.new_score);

    // Validate new_score
    if (isNaN(new_score) || new_score < 0 || new_score > 10) {
      return res
        .status(400)
        .json({ error: "Invalid score. Must be between 0 and 10." });
    }

    // Determine category based on score
    let evaluation_category;
    if (new_score < 4) {
      evaluation_category = "rejected";
    } else if (new_score < 7) {
      evaluation_category = "revisit";
    } else {
      evaluation_category = "shortlisted";
    }

    // Find the evaluation along with its submission, hackathon, and student
    const evaluation = await Evaluation.findOne({ submission_id })
      .populate("submission_id")
      .populate({
        path: "submission_id",
        populate: { path: "hackathon_id student_id" },
      });

    if (!evaluation || !evaluation.submission_id) {
      return res.status(404).json({ error: "Evaluation not found." });
    }

    const { hackathon_id, student_id } = evaluation.submission_id;

    // Update the evaluation score and category
    const updatedEvaluation = await Evaluation.findOneAndUpdate(
      { submission_id },
      { $set: { overall_score: new_score, evaluation_category } },
      { new: true, runValidators: true }
    );

    // Remove the student from all categories first
    await Hackathon.findByIdAndUpdate(hackathon_id._id, {
      $pull: {
        shortlisted_students: student_id._id,
        revisit_students: student_id._id,
        rejected_students: student_id._id,
      },
    });

    // Add the student to the correct category
    const categoryField =
      evaluation_category === "shortlisted"
        ? "shortlisted_students"
        : evaluation_category === "revisit"
        ? "revisit_students"
        : "rejected_students";

    await Hackathon.findByIdAndUpdate(hackathon_id._id, {
      $push: { [categoryField]: student_id._id },
    });

    res.status(200).json({
      message: "Evaluation score updated successfully.",
      overall_score: updatedEvaluation.overall_score,
      evaluation_category: updatedEvaluation.evaluation_category,
    });
  } catch (error) {
    console.error("Error updating evaluation score:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitSolution,
  updateEvaluationCategory,
  bulkUpdateEvaluationCategory,
  editEvaluationScore,
};
