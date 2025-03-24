const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { extractText } = require("../utils/textExtractor");
const { analyzeText, analyzeAudio } = require("../utils/geminiAnalysis");
const { extractAudioFromVideo } = require("../utils/videoProcessor");
const { uploadFileToS3 } = require("../utils/s3Uploader");
const Submission  = require("../models/Submission");
const Evaluation  = require("../models/Evaluation");
const Hackathon = require("../models/Hackathon");

// ✅ Process File (Extract Text / Convert Audio)
const processFile = async (filePath, fileType,problemStatement,judgement_parameters,custom_prompt) => {
  if (fileType.startsWith("audio/")) {
    return { extractedText: "", evaluationResult: await analyzeAudio(problemStatement, judgement_parameters, filePath, custom_prompt) };
  } 
  if (fileType.startsWith("video/")) {
    const audioPath = await extractAudioFromVideo(filePath);
    return { extractedText: "", evaluationResult: await analyzeAudio(problemStatement, judgement_parameters, audioPath, custom_prompt) };
  } 
  
  // ✅ Extract Text for Text-Based Files
  const extractedText = await extractText(filePath, fileType);
  const evaluationResult = await analyzeText(extractedText,);
  return { extractedText, evaluationResult };
};

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

    const { hackathon_id, student_id } = req.body;

    if (!hackathon_id) {
      return res.status(400).json({ error: "Hackathon ID is required." });
    }

    if (!student_id) {
      return res.status(400).json({ error: "Student ID is required." });
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const originalFileName = req.file.originalname;

    // ✅ Create Submission Entry First
    const submission = new Submission({
      hackathon_id,
      student_id,
      submission_url: "", // Will be updated after S3 upload
    });

    await submission.save();

    // ✅ Save file locally with submission ID
    const fileExtension = path.extname(originalFileName);
    const fileName = `${student_id}${fileExtension}`;
    const tempFilePath = await saveFileLocally(fileBuffer, fileName);

    // ✅ Upload file to S3
    const fileUrl = await uploadFileToS3(
      fileBuffer,
      `uploads/${submission._id}_${fileName}`,
      fileType
    );

    // ✅ Update Submission with uploaded file URL
    submission.submission_url = fileUrl;
    await submission.save();

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
      // Destructure and assign to evaluationResult
      const { extractedText, evaluationResult: evalRes } = result;
      // console.log("Type of evaluationResult:", typeof evalRes);
      // JSON.parse(evalRes);

      evaluationResult = evalRes;
      // console.log("Evaluation Result1:", evaluationResult);

      // ✅ Create Evaluation Entry with the exact return structure and update status to "completed"
      const evaluation = new Evaluation({
        submission_id: submission._id,
        evaluation_status: "completed", // set status to completed
        parameter_feedback: evaluationResult.parameter_feedback,
        improvement: evaluationResult.improvement,
        actionable_steps: evaluationResult.actionable_steps,
        strengths: evaluationResult.strengths,
        overall_score: evaluationResult.overall_score,
        overall_reason: evaluationResult.overall_reason,
        summary: evaluationResult.summary,
      });

      await evaluation.save();

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
    res.status(200).json({
      message: "Submission processed successfully",
      submission, // includes submission ID and linked evaluation_id
      evaluation: {
        overall_score: evaluationResult.overall_score,
        overall_reason: evaluationResult.overall_reason,
        parameter_feedback: evaluationResult.parameter_feedback,
        improvement: evaluationResult.improvement,
        actionable_steps: evaluationResult.actionable_steps,
        strengths: evaluationResult.strengths,
        summary: evaluationResult.summary,
      },
    });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ error: "Error processing submission" });
  }
};



module.exports = { submitSolution };
