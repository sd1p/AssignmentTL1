const asyncHandler = require("express-async-handler");
const Question = require("../models/questionSchema");
const mongoose = require("mongoose");
const FormData = require("form-data");
const axios = require("axios");

//create questions
exports.addQuestion = asyncHandler(async (req, res) => {
  let { name, body, masterjudgeId = 999 } = req.body;

  //checking valid fields
  if (!name || !body) {
    res.status(400);
    throw new Error("Please enter the question name and question body");
  }

  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("body", body);
  bodyFormData.append("masterjudgeId", masterjudgeId);

  const { data } = await axios({
    method: "post",
    url: `https://4160a1d9.problems.sphere-engine.com/api/v4/problems?access_token=${process.env.SE_API_TOKEN}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const question = await Question.create({
    name,
    body,
    problemId: data.id,
    masterjudgeId,
  });

  if (question) {
    res
      .status(201)
      .json({ question, message: "Question created successfully" });
  } else {
    res.status(400);
    throw new Error("Question not created");
  }
});

//update questions
exports.updateQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    res.status(400);
    throw new Error("Please enter a valid questionID ");
  }

  let question = await Question.findById(questionId);

  //cheking if question exists
  if (!question) {
    res.status(400);
    throw new Error("Question not found");
  }

  //cheking for modified fields and retaining previous values
  let {
    name = question.name,
    body = question.body,
    masterjudgeId = 999,
  } = req.body;

  //updating problemId
  let bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("body", body);
  bodyFormData.append("masterjudgeId", masterjudgeId);

  const { data } = await axios({
    method: "put",
    url: `https://4160a1d9.problems.sphere-engine.com/api/v4/problems/${question.problemId}?access_token=${process.env.SE_API_TOKEN}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  question = await Question.findByIdAndUpdate(
    questionId,
    {
      name,
      body,
      masterjudgeId,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ question, message: "Question updated successfully" });
});

//deleting a questions by ID.
exports.deleteQuestionsById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  //question ID validation
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    res.status(400);
    throw new Error("Please enter a valid questionID ");
  }

  let question = await Question.findById(questionId);
  if (!question) {
    res.status(400);
    throw new Error("Question not found");
  }

  const { data } = await axios({
    method: "delete",
    url: `https://4160a1d9.problems.sphere-engine.com/api/v4/problems/${question.problemId}?access_token=${process.env.SE_API_TOKEN}`,
  });

  question = await Question.findByIdAndDelete(questionId);

  res.status(200).json({ message: `Deleted question ${questionId}` });
});

//createing testcases
exports.addTestCase = asyncHandler(async (req, res) => {
  let { input = "", output, judgeId = 1 } = req.body;
  const { questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    res.status(400);
    throw new Error("Please enter a valid questionID ");
  }

  const question = await Question.findById(questionId);

  if (question) {
    const bodyFormData = new FormData();
    bodyFormData.append("input", input);
    bodyFormData.append("output", output);
    bodyFormData.append("judgeId", judgeId);
    console.log("hi");
    const { data } = await axios({
      method: "post",
      url: `https://4160a1d9.problems.sphere-engine.com/api/v4/problems/${question.problemId}/testcases?access_token=${process.env.SE_API_TOKEN}`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    res.status(201).json({
      testCaseNo: data.number,
      message: "Test case created successfully",
    });
  } else {
    res.status(400);
    throw new Error("Question not found");
  }
});

//finding all questions.
exports.getAllQuestions = asyncHandler(async (req, res) => {
  const question = await Question.find();

  if (question) {
    res.status(200).json(question);
  } else {
    res.status(400);
    throw new Error("No Questions found");
  }
});

//finding a questions by ID.
exports.getQuestionsById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  //Question ID validation
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    res.status(400);
    throw new Error("Please enter a valid questionID ");
  }

  const question = await Question.findById(questionId);

  if (question) {
    res.status(200).json(question);
  } else {
    res.status(400);
    throw new Error("Question not found");
  }
});

//finding questions with pagination.
exports.getPaginatedQuestions = asyncHandler(async (req, res) => {
  let { page, resultPerPage = 4 } = req.query;
  let skip = (page - 1) * resultPerPage;
  const question = await Question.find().limit(resultPerPage).skip(skip);

  if (question) {
    res.status(200).json(question);
  } else {
    res.status(400);
    throw new Error("Questions not found");
  }
});
