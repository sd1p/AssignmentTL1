const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { submitSolution } = require("../controllers/submissionController");

const router = express.Router();

router.route("/:questionId").post(isAuthenticated, submitSolution);

module.exports = router;
