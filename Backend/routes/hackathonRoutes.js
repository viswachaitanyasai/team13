const express = require("express");
const {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
  getHackathonsByTeacher,
  getHackathonRegistrations,
  getHackathonSubmissions,
  joinHackathon,
} = require("../controllers/hackathonController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createHackathon);
router.get("/", authMiddleware, getHackathons);
router.get("/:hackathon_id", getHackathonById);
router.get("/:hackathon_id/registrations", authMiddleware, getHackathonRegistrations);
router.get("/:hackathon_id/submissions", authMiddleware, getHackathonSubmissions);
router.put("/:hackathon_id", authMiddleware, editHackathon);
router.delete("/:hackathon_id", authMiddleware, removeHackathon); // Protected delete route
router.get("/teacher/:teacher_id", authMiddleware, getHackathonsByTeacher);
// router.post("/join", joinHackathon); // Students join using invite code



module.exports = router;
