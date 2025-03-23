const express = require("express");

const router = express.Router();
const { submit } = require("../controllers/submissionController");

router.post("/submit", submit);

module.exports = router;
