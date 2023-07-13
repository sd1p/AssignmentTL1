const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { submitSolution } = require("../controllers/submissionController");

const router = express.Router();

router.route("/:questionId").post(submitSolution);

module.exports = router;
