const express = require("express");
const router = express.Router();

//@desc authorization midlleware for protected routes
const {protect} = require("../middleware/authMiddleware")

//@desc user CRUD functions from user controller for user routes
const {
  signUpUsers,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

//@desc all user routes
router.post("/signUp", signUpUsers);
router.post("/login", login);
router.get("/", getUsers);
router.route("/:id").get(protect, getUser).patch(protect, updateUser).delete(protect, deleteUser);

module.exports = router;
