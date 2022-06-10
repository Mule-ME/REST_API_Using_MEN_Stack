const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const secret = process.env.JWT_SECRET;

//@desc Create User
//@route POST /api/users/signUp
//@access Public
const signUpUsers = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //Check if user exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(409);
    throw new Error("User already exists");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  if (user) {
    res.status(201).json({
      message: "User created successfully",
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      //   token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc login User
//@route POST /api/users/login
//@access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

//Generate Token using JWT
const generateToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

//@desc Get Users
//@route GET /api/users/
//@access Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 200,
    data: users,
  });
});

//@desc get User
//@route GET /api/users/
//@access Public
const getUser = asyncHandler(async (req, res) => {

  const id = req.params.id;

  const user = await User.findById({ _id: id });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  res.status(200).json({
    status: 200,
    data: user,
  });
});

//@desc Update User
//@route PATCH /api/users/
//@access Public
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = User.findById({ _id: id });

  if (!user) {
    req.status(400);
    throw new Error("User not found");
  }

  //Hash password
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  };
  const updateUser = await User.findByIdAndUpdate(req.params.id, updatedUser);
  res.status(200).json({
    message: "User updated successfully",
    data: updateUser,
  });
});

//@desc Delete Userr
//@route DELETE /api/users/
//@access Public
const deleteUser = asyncHandler(async (req, res) => {

  const id = req.params.id;

  if (!id) {
    req.status(400);
    throw new Error("User not found");
  }

  const user = await User.findOneAndDelete({ _id: id });

  res.status(200).json({
    message: "User deleted successfully",
  });
});

module.exports = {
  signUpUsers,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
