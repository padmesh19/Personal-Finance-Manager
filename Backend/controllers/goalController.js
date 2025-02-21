const Goal = require("../models/Goal");
const moment = require("moment");

const goalController = {
  // Get Goals
  getGoals: async (req, res) => {
    try {
      const user_id = req.user._id;
      const goals = await Goal.aggregate([
        {
          $match: {
            user_id: { $eq: user_id },
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            name: 1,
            targetAmount: 1,
            currentAmount: 1,
            deadline: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$deadline",
              },
            },
            status: 1,
          },
        },
      ]);
      if (!goals) return res.status(404).json({ message: "No Data" });
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get Goal
  getGoal: async (req, res) => {
    try {
      const goal_id = req.params.id;
      const goal = await Goal.findById(goal_id).select("-__v");
      if (!goal) return res.status(404).json({ message: "goal not found" });
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add Goal
  addGoal: async (req, res) => {
    const user_id = req.user.id;
    const { name, targetAmount, currentAmount, deadline } = req.body;
    const dead_line = moment(deadline).format("YYYY-MM-DD");
    try {
      const goal = await Goal.create({
        user_id: user_id,
        name,
        targetAmount,
        currentAmount,
        deadline: dead_line,
      });
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Goal
  updateGoal: async (req, res) => {
    const { name, targetAmount, currentAmount, deadline } = req.body;
    const dead_line = moment(deadline).format("YYYY-MM-DD");
    try {
      const goal_id = req.params.id;
      const goal = await Goal.findById(goal_id);
      if (!goal) return res.status(404).json({ message: "Goal not found" });

      goal.name = name || goal.name;
      goal.targetAmount = targetAmount || goal.targetAmount;
      goal.currentAmount = currentAmount || goal.currentAmount;
      goal.deadline = dead_line || goal.deadline;
      await goal.save();

      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Goal
  deleteGoal: async (req, res) => {
    try {
      const goal_id = req.params.id;
      await Goal.findByIdAndDelete(goal_id);
      res.status(200).json(goal_id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  contributeGoal: async (req, res) => {
    const { currentAmount } = req.body;
    try {
      const goal_id = req.params.id;
      const goal = await Goal.findById(goal_id);
      if (!goal) return res.status(404).json({ message: "Goal not found" });

      goal.currentAmount = currentAmount || goal.currentAmount;
      await goal.save();

      res.status(200).json(goal);
    } catch (error) {
      
    }
  }
};

module.exports = goalController;
