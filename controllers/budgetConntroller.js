const Budget = require('../models/budget');
const Expense = require('../models/expense');

// GET /api/budget
exports.getBudgetSummary = async (req, res) => {
  try {
    const userId = req.user.id; // set by your auth middleware

    const budget = await Budget.findOne({ user: userId });
    const monthlyLimit = budget ? budget.monthlyLimit : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const result = await Expense.aggregate([
      {
        $match: {
          user: budget ? budget.user : userId,
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const spent = result.length > 0 ? result[0].total : 0;
    const percentUsed = monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0;

    let status = 'ok';
    if (percentUsed > 100) status = 'over';
    else if (percentUsed > 80) status = 'warning';

    res.json({
      monthlyLimit,
      spent,
      percentUsed: Math.round(percentUsed * 10) / 10,
      status,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load budget summary', error: err.message });
  }
};

// PUT /api/budget
exports.setBudgetLimit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monthlyLimit } = req.body;

    if (typeof monthlyLimit !== 'number' || monthlyLimit < 0) {
      return res.status(400).json({ message: 'monthlyLimit must be a positive number' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: userId },
      { monthlyLimit },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update budget', error: err.message });
  }
};

// POST /api/budget/expenses
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, description, date } = req.body;

    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: 'amount must be a positive number' });
    }

    const expense = await Expense.create({
      user: userId,
      amount,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense', error: err.message });
  }
};