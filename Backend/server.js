const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const gradingRoutes = require("./routes/gradingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/submissions", gradingRoutes);

mongoose.connect(process.env.MONGO_URI, () => console.log("DB connected"));
app.listen(5000, () => console.log("Server running on port 5000"));
