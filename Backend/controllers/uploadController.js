const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
require("dotenv").config();

// ✅ Initialize AWS S3 Client (SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Multer Storage (Temporary Memory Storage before Upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload File to S3
const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileName = `uploads/${Date.now()}_${req.file.originalname}`;

    // ✅ Upload Command
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      // ACL: "public-read", // Allows public access
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // ✅ Generate Public File URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

module.exports = {
  uploadMiddleware: upload.single("file"),
  uploadFile,
};
