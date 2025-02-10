const Budget = require("../models/Budget");
const moment = require("moment");

const getBudgetbyUser = async (user_id) => {
  return await Budget.aggregate([
    {
      $match: {
        user_id: { $eq: user_id },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        category: 1,
        _id: 1,
        period: {
          startDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$period.startDate",
            },
          },
          endDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$period.endDate",
            },
          },
        },
        category_id: 1,
        user_id: 1,
        amount: 1,
        spent: 1,
      },
    },
  ]);
};

const budgetController = {
  // Get Budgets
  getBudgets: async (req, res) => {
    try {
      const user_id = req.user._id;
      const budgets = await getBudgetbyUser(user_id);
      if (!budgets) return res.status(404).json({ message: "No Data" });
      res.status(200).json(budgets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add Budget
  addBudget: async (req, res) => {
    const user_id = req.user._id;
    const { amount, spent, startDate, endDate, category_id } = req.body;
    const start_date = moment(startDate).format("YYYY-MM-DD");
    const end_date = moment(endDate).format("YYYY-MM-DD");
    try {
      const budget = new Budget({
        user_id: user_id,
        amount,
        spent,
        period: { startDate: start_date, endDate: end_date },
        category_id,
      });
      //   const allBudgets = await getBudgetbyUser(user_id);
      //   const preBudget = allBudgets.filter(
      //     (budget) =>
      //       (budget.category_id == category_id) &&
      //       (moment(budget.period.endDate).isAfter(start_date)) &&
      //       (moment(budget.period.startDate).isBefore(start_date))
      //     );
      //     console.log(preBudget)

      await budget.save();
      const currBudget = await getBudgetbyUser(user_id);
      res.status(201).json(currBudget[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Budget
  updateBudget: async (req, res) => {
    const user_id = req.user._id;
    const { amount, spent, startDate, endDate, category_id } = req.body;
    const start_date = moment(startDate).format("YYYY-MM-DD");
    const end_date = moment(endDate).format("YYYY-MM-DD");
    try {
      const budget_id = req.params.id;
      const budget = await Budget.findById(budget_id);
      if (!budget) return res.status(404).json({ message: "budget not found" });

      budget.amount = amount || budget.amount;
      budget.spent = spent || budget.spent;
      budget.period.startDate = start_date || budget.period.startDate;
      budget.period.endDate = end_date || budget.period.endDate;
      budget.category_id = category_id || budget.category_id;
      await budget.save();
      
      const currBudget = await Budget.aggregate([
        {
          $match: {
            _id: { $eq: budget._id },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $project: {
            category: 1,
            _id: 1,
            period: {
              startDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.startDate",
                },
              },
              endDate: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$period.endDate",
                },
              },
            },
            category_id: 1,
            user_id: 1,
            amount: 1,
            spent: 1,
          },
        },
      ]);
      res.status(200).json(currBudget[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Budget
  deleteBudget: async (req, res) => {
    try {
      const user_id = req.user._id;
      const budget_id = req.params.id;
      await Budget.findByIdAndDelete(budget_id);
      res.status(200).json(budget_id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = budgetController;
