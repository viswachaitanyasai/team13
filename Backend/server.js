const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const studentRoutes = require("./routes/studentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const app = express();

// ✅ Dynamic Allowed Origins (Works for both development & production)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL1,
  process.env.FRONTEND_URL2,
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow all methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow custom headers
  })
);

// ✅ Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Connect to MongoDB before starting the server
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/files", uploadRoutes);
app.use("/api/quiz", quizRoutes);


// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
