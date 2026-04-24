const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");

const auth = require("../middleware/authMiddleware");

// All routes protected
router.post("/", auth, createCategory);
router.get("/", auth, getCategories);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;