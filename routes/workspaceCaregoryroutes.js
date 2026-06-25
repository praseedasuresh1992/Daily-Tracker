const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require(
  "../controllers/workspaceCategoryController"
);

const {
  authUser,
} = require("../middleware/authMiddleware");

router.post(
  "/:workspaceId/categories",
  authUser,
  createCategory
);

router.get(
  "/:workspaceId/categories",
  authUser,
  getCategories
);

router.delete(
  "/categories/:categoryId",
  authUser,
  deleteCategory
);

module.exports = router;