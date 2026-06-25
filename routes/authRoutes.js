// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const upload=require("../middleware/upload")

const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  verifyPassword,
  sendResetOTP,
  resetPasswordOTP
} = require("../controllers/authControllers");

const { authUser } = require("../middleware/authMiddleware");

// Auth
router.post("/register",upload.single("profile"), registerUser);
router.post("/login", loginUser);
// Get logged-in user
router.get("/profile", authUser, getUser);

// Profile actions
router.put("/profile", authUser, updateUser);
router.delete("/profile", authUser, deleteUser);

router.post("/verify-password",authUser,verifyPassword);

router.post("/send-reset-otp",sendResetOTP);
router.post("/reset-password-otp",resetPasswordOTP);

module.exports = router;