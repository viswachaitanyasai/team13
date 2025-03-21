const express = require("express");
const {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
  joinHackathon,
} = require("../controllers/hackathonController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createHackathon);
router.get("/", authMiddleware, getHackathons);
router.get("/:hackathon_id", getHackathonById);
router.put("/:hackathon_id", authMiddleware, editHackathon);
router.delete("/:hackathon_id", authMiddleware, removeHackathon); // Protected delete route

router.post("/join", joinHackathon); // Students join using invite code



module.exports = router;
