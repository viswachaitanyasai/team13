const fs = require("fs");
const path = require("path");
const { extractText } = require("../utils/textExtractor");
const { analyzeText, analyzeAudio } = require("../utils/geminiAnalysis");
const { extractAudioFromVideo } = require("../utils/videoProcessor");
const { uploadFileToS3 } = require("../utils/s3Uploader");
const { Submission } = require("../models/Submission");
const { Evaluation } = require("../models/Evaluation");

// ✅ Process File (Extract Text / Convert Audio)
const processFile = async (filePath, fileType,problemStatement,judgement_parameters,custom_parameters) => {
  if (fileType.startsWith("audio/")) {
    return { extractedText: "", evaluationResult: await analyzeAudio(problemStatement, judgement_parameters, filePath, custom_parameters) };
  } 
  if (fileType.startsWith("video/")) {
    const audioPath = await extractAudioFromVideo(filePath);
    return { extractedText: "", evaluationResult: await analyzeAudio(problemStatement, judgement_parameters, audioPath, custom_parameters) };
  } 
  
  // ✅ Extract Text for Text-Based Files
  const extractedText = await extractText(filePath, fileType);
  const evaluationResult = await analyzeText(extractedText);
  return { extractedText, evaluationResult };
};

// ✅ Save File Locally
const saveFileLocally = (fileBuffer, fileName) => {
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);
  return filePath;
};

const submitSolution = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { hackathon_id } = req.body;
    const student_id = req.user?.id; // Ensure req.user exists

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
      extracted_text: "", // Will be updated later
    });

    await submission.save();

    // ✅ Generate temp file path with submission_id
    // Extract file extension
    const fileExtension = path.extname(originalFileName); // e.g., ".pdf", ".png"

    // Define the new file name format: "student_id.ext"
    const fileName = `${student_id}${fileExtension}`;

    // Generate the temporary file path
    const tempFilePath = saveFileLocally(fileBuffer, fileName);

    // ✅ Upload file to S3
    const fileUrl = await uploadFileToS3(
      fileBuffer,
      `uploads/${submission._id}_${fileName}`,
      fileType
    );

    // ✅ Update Submission with the uploaded file URL
    submission.submission_url = fileUrl;
    await submission.save();

    //done till here just need to pass the req details to processfile
    const { extractedText, evaluationResult } = processFile(tempFilePath, fileType);

    // ✅ Analyze extracted text

    // const evaluationResult = await analyzeText(extractedText);

    // ✅ Create Evaluation Entry
    const evaluation = new Evaluation({
      submission_id: submission._id,
      extracted_text,
      evaluationResult,
    });

    await evaluation.save();

    // ✅ Link Submission with Evaluation
    submission.evaluation_id = evaluation._id;
    submission.extracted_text = extractedText; // Update extracted text
    await submission.save();

    // ✅ Delete temporary file
    fs.unlinkSync(tempFilePath);

    res.status(200).json({
      message: "Submission processed successfully",
      submission,
      evaluation,
    });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ error: "Error processing submission" });
  }
};

module.exports = { submitSolution };
