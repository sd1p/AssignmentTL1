const asyncHandler = require("express-async-handler");
const Question = require("../models/questionSchema");
const mongoose = require("mongoose");
const FormData = require("form-data");
const axios = require("axios");
const sendEmail = require("../config/nodemailer");

//IMPORTATNT TO HAVE DELAY IN CHECKING STATUS OF A SUBMISSION
const delay = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
//delay of 2s
/////////////////

//submiting a solution
exports.submitSolution = asyncHandler(async (req, res) => {
  const { source, compilerId, compilerVersionId } = req.body;
  const { questionId } = req.params;

  //validation
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    res.status(400);
    throw new Error("Please enter a valid questionID ");
  }

  let question = await Question.findById(questionId);

  if (!question) {
    res.status(400);
    throw new Error("Question not found");
  }

  let bodyFormData = new FormData();
  bodyFormData.append("problemId", question.problemId);
  bodyFormData.append("source", source);
  bodyFormData.append("compilerId", compilerId);
  bodyFormData.append("compilerVersionId", compilerVersionId);

  //submission
  const { data: submissionData } = await axios({
    method: "post",
    url: `https://4160a1d9.problems.sphere-engine.com/api/v4/submissions?access_token=${process.env.SE_API_TOKEN}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  let submissionStatus;

  //waiting for 10s max
  //fetching status of submission every 2 seconds
  for (let i = 0; i < 5; i++) {
    await delay();
    const { data } = await axios({
      method: "get",
      url: `https://4160a1d9.problems.sphere-engine.com/api/v4/submissions/${submissionData.id}?access_token=${process.env.SE_API_TOKEN}`,
    });
    if (!data.executing) {
      submissionStatus = data.result.status.name;
      break;
    }
  }

  //nodemailer
  sendEmail({
    email: req.user.email,
    subject: "Code Submission",
    message: `Question Submitted successfully status: ${submissionStatus}`,
  });
  res.status(200).json({
    status: submissionStatus,
    message: "Question Submitted successfully",
  });
});
