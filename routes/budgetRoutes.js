const express = require("express");

const router = express.Router();

const {
  getBudgetSummary,
  setBudgetLimit,
} = require("../controllers/budgetConntroller");

const { authUser } = require("../middleware/authMiddleware");

// Get current budget + monthly spending
router.get(
  "/",
  authUser,

  getBudgetSummary
);

// Set/update monthly budget
router.put(
  "/",
  authUser,
  setBudgetLimit
);

module.exports = router;