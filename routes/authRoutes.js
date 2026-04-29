// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/authControllers");

const protect = require("../middleware/authMiddleware");

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
// Get logged-in user
router.get("/profile", protect, getUser);

// Profile actions
router.put("/profile", protect, updateUser);
router.delete("/profile", protect, deleteUser);

module.exports = router;