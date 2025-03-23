const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const gradingRoutes = require("./routes/gradingRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://eduhack.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow sending cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());

// ✅ Connect to MongoDB before starting the server
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/submissions", gradingRoutes);
app.use("/api/analytics/", analyticsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
