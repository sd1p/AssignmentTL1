const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//middleware for autherization of users
exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  //handling cookie and header method
  const token = req.cookies.token
    ? req.cookies.token
    : req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return next(new Error("Please login to access this resource"));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

//middleware for securing admin routes
exports.adminRoute = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new Error("Admin route, invalid access"));
  }
  next();
};
