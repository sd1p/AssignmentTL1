const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//controller for user registration
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  //checking valid fields
  if (!name | !email | !password | !role) {
    res.status(400);
    throw new Error("Please enter all the valid fields");
  }

  if (role !== "user" && role !== "admin") {
    res.status(400);
    throw new Error("Please a valid role 'user' or 'admin'");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists with this email address");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24
      ),
      httpOnly: true,
    };

    const token = user.getJWTToken();
    res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({ email, token });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

//controller for user login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //matching password with comparePassword method defined at user schema.
  const match = async (password) => {
    if (password === "") {
      return false;
    }
    return await user.comparePassword(password);
  };

  //if user is found and password matches sending cookie and JWT token to client
  if (user && match) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24
      ),
      httpOnly: true,
    };
    token = user.getJWTToken();
    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ email, token });
  } else {
    res.status(400).json({ message: "Inavalid Email Address or Password" });
  }
});

//getting logged user Details
exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

//clearing client cookie for logout
exports.logoutUser = asyncHandler((req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
