require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const Submission = require("./models/Submission"); // Your Mongoose Submission Model

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Multer storage for file uploads (if storing locally)
const upload = multer({ dest: "uploads/" });

// API Endpoint: Submit a file
app.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { hackathon_id, student_id } = req.body;
    const mediaUrl = req.file ? req.file.path : req.body.media_url; // Support both file uploads & URLs

    // Store initial submission
    const submission = new Submission({
      hackathon_id,
      student_id,
      submission_url: mediaUrl,
    });
    await submission.save();
    console.log(`📥 Submission saved: ${mediaUrl}`);

    // Process the file based on type
    const fileExtension = getFileExtension(mediaUrl);
    let extractedText = "";

    if (isAudio(fileExtension)) {
      extractedText = await transcribeAudio(mediaUrl);
    } else if (isVideo(fileExtension)) {
      const audioPath = await extractAudioFromVideo(mediaUrl);
      extractedText = await transcribeAudio(audioPath);
    } else if (isDocument(fileExtension)) {
      extractedText = await extractTextFromDocument(mediaUrl);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Update submission with extracted text
    submission.extractedText = extractedText;
    await submission.save();

    res.json({ message: "✅ Submission processed", submission });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Utility: Get file extension
function getFileExtension(url) {
  return path.extname(url).toLowerCase();
}

// Utility: Check file type
const isAudio = (ext) =>
  [".mp3", ".wav", ".m4a", ".flac", ".ogg"].includes(ext);
const isVideo = (ext) => [".mp4", ".mkv", ".avi", ".mov", ".flv"].includes(ext);
const isDocument = (ext) =>
  [".ppt", ".pptx", ".pdf", ".doc", ".docx"].includes(ext);

// Function: Transcribe audio using Whisper API
async function transcribeAudio(audioUrl) {
  try {
    console.log(`🎙️ Transcribing audio: ${audioUrl}`);
    const response = await axios.post("https://api.whisper.com/transcribe", {
      audio_url: audioUrl,
      api_key: process.env.WHISPER_API_KEY,
    });
    return response.data.transcription || "No transcription found";
  } catch (error) {
    console.error("❌ Error transcribing audio:", error);
    return "Transcription failed";
  }
}

// Function: Extract audio from video
async function extractAudioFromVideo(videoPath) {
  return new Promise((resolve, reject) => {
    const audioPath = videoPath.replace(/\.\w+$/, ".mp3");
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("libmp3lame")
      .on("end", () => resolve(audioPath))
      .on("error", reject)
      .run();
  });
}

// Function: Extract text from document (Uses Custom API)
async function extractTextFromDocument(docUrl) {
  try {
    console.log(`📜 Extracting text from document: ${docUrl}`);
    const response = await axios.post(process.env.CUSTOM_DOC_API, {
      file_url: docUrl,
    });
    return response.data.text || "No text extracted";
  } catch (error) {
    console.error("❌ Error extracting text:", error);
    return "Text extraction failed";
  }
}

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
