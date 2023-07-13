const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  //user input
  name: {
    type: String,
    required: [true, "Please enter a question title."],
  },

  body: {
    type: String,
    required: [true, "Please enter a question discription."],
  },

  //server defined
  masterjudgeId: {
    type: Number,
    default: 999,
  },

  problemId: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
