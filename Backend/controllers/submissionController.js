const {
  getFileExtension,
  isAudio,
  transcribeAudio,
  extractAudioFromVideo,
  extractTextFromDocument,
} = require("../utils/extractionUtils");

const Submission = require("./models/Submission");

const submit = async (req, res) => {
  try {
    const { hackathon_id, student_id, mediaUrl } = req.body;
    const submission = new Submission({
      hackathon_id,
      student_id,
      submission_url: mediaUrl,
    });
    await submission.save();

    // submission part done now extracting text

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
};

module.exports = { submit };
