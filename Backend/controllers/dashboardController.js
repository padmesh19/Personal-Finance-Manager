const moment = require("moment");

const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const Category = require("../models/Category");

const dashboardController = {
  // Fetch dashboard data
  fetchData: async (req, res) => {
    try {
      const user_id = req.user._id;

      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();

      const [totalExpenseAmount] = await Transaction.aggregate([
        {
          $match: {
            date: { $gte: startOfMonth, $lte: endOfMonth },
            transaction_type: "expense",
            user_id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);
      const [totalIncomeAmount] = await Transaction.aggregate([
        {
          $match: {
            date: { $gte: startOfMonth, $lte: endOfMonth },
            transaction_type: "income",
            user_id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const totalBudget = await Budget.aggregate([
        {
          $match: {
            "period.startDate": { $gte: startOfMonth },
            "period.endDate": { $lte: endOfMonth },
            user_id,
          },
        },
      ]);
      const totalGoal = await Goal.aggregate([
        {
          $match: {
            deadline: { $gte: startOfMonth },
            user_id,
          },
        },
      ]);
      return res.status(200).json({
        Income: totalIncomeAmount?.total || 0,
        Expense: totalExpenseAmount?.total || 0,
        Budget: totalBudget?.length || 0,
        Goals: totalGoal?.length || 0,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = dashboardController;
