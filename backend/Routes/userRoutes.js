const express = require("express");
const {
  registerUser,
  loginUser,
  getUserDetails,
  logoutUser,
} = require("../controllers/userController");

const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/details").get(isAuthenticated, getUserDetails);
router.route("/logout").get(logoutUser);

module.exports = router;
