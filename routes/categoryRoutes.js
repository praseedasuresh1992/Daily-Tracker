const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");

const {authUser} = require("../middleware/authMiddleware");

// All routes protected
router.post("/", authUser, createCategory);
router.get("/", authUser, getCategories);
router.put("/:id", authUser, updateCategory);
router.delete("/:id", authUser, deleteCategory);

module.exports = router;