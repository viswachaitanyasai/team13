const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

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

module.exports = {
  getFileExtension,
  isAudio,
  transcribeAudio,
  extractAudioFromVideo,
  extractTextFromDocument,
};
