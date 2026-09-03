const Budget = require("../models/Budget");
const Task = require("../models/Task");

// ==========================================
// GET MONTHLY BUDGET SUMMARY
// GET /api/budget
// ==========================================
exports.getBudgetSummary = async (req, res) => {
  try {
    console.log("Fetching budget summary for user:", req.user.id);
    const userId = req.user.id;
console.log(`Fetching budget summary for user ${userId}`);
    // Find user's budget
    const budget = await Budget.findOne({
      user: userId,
    });
    console.log(`User ${userId} budget:`, budget);

    const monthlyLimit = budget ? budget.monthlyLimit : 0;

    // Current month start
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Next month start
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Get current month's tasks
const result = await Task.aggregate([
  {
    $match: {
      user: userId,

      // Only current month's tasks
      taskDate: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },

      // Only completed tasks
      status: "completed",

      // Ignore deleted tasks
      isDeleted: {
        $ne: true,
      },
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: {
          $toDouble: "$amount",
        },
      },
    },
  },
]);
console.log("Aggregation result:", result);

    const spent =
  result.length > 0
    ? result[0].total
    : 0;
    console.log(`User ${userId} spent ${spent} this month`);
    // Calculate percentage
    const percentUsed =
      monthlyLimit > 0
        ? (spent / monthlyLimit) * 100
        : 0;

    // Determine status
    let status = "ok";

    if (percentUsed >= 100) {
      status = "over";
    } else if (percentUsed >= 80) {
      status = "warning";
    }

    res.json({
      monthlyLimit,
      spent,
      percentUsed:
        Math.round(percentUsed * 10) / 10,
      status,
    });
  } catch (err) {
    console.error("Budget summary error:", err);

    res.status(500).json({
      message: "Failed to load budget summary",
      error: err.message,
    });
  }
};


// ==========================================
// SET MONTHLY BUDGET
// PUT /api/budget
// ==========================================
exports.setBudgetLimit = async (req, res) => {
  try {
const userId = new mongoose.Types.ObjectId(req.user.id);
    const { monthlyLimit } = req.body;

    // Convert string input to number
    const limit = Number(monthlyLimit);

    // Validate
    if (
      Number.isNaN(limit) ||
      limit < 0
    ) {
      return res.status(400).json({
        message:
          "Monthly budget must be a valid positive number",
      });
    }

    // Create or update budget
    const budget =
      await Budget.findOneAndUpdate(
        {
          user: userId,
        },
        {
          user: userId,
          monthlyLimit: limit,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.json({
      message: "Monthly budget updated successfully",
      budget,
    });
  } catch (err) {
    console.error("Set budget error:", err);

    res.status(500).json({
      message: "Failed to update budget",
      error: err.message,
    });
  }
};