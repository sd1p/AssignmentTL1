const express = require("express");
const { isAuthenticated, adminRoute } = require("../middleware/auth");
const {
  addQuestion,
  updateQuestion,
  getAllQuestions,
  getQuestionsById,
  deleteQuestionsById,
  getPaginatedQuestions,
  addTestCase,
} = require("../controllers/questionsController");

const router = express.Router();

//admin routes
router.route("/create").post(isAuthenticated, adminRoute, addQuestion);
router
  .route("/update/:questionId")
  .put(isAuthenticated, adminRoute, updateQuestion);
router
  .route("/delete/:questionId")
  .delete(isAuthenticated, adminRoute, deleteQuestionsById);

router
  .route("/testcase/:questionId")
  .post(isAuthenticated, adminRoute, addTestCase);

//user routes to get questions
router.route("/list").get(isAuthenticated, getAllQuestions);
router.route("/list/:questionId").get(isAuthenticated, getQuestionsById);
router.route("/index").get(isAuthenticated, getPaginatedQuestions);

module.exports = router;
