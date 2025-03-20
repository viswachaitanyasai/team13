const express = require("express");
const {
  createHackathon,
  getHackathons,
  getHackathonById,
} = require("../controllers/hackathonController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createHackathon);
router.get("/", authMiddleware, getHackathons);
router.get("/:hackathon_id", authMiddleware, getHackathonById);

module.exports = router;
