const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//@desc imporing user model to generate token
const User = require("../models/User");

//@desc importing JSON_SECRET from .env(enviroment variable)
const secret = process.env.JWT_SECRET;


const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      //@desc Get token from headers
      token = req.headers.authorization.split(" ")[1];

      //@desc Verify token
      const decodedToken = jwt.verify(token, secret);
      req.userData = await User.findById(decodedToken.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
});

//@desc NODE Export metod
module.exports = { protect };
