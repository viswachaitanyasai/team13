const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URI;

const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, options);
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// ✅ Handle connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

// ✅ Handle disconnections
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected.");
});

module.exports = connectDB;
