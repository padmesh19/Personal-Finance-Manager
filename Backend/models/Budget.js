const mongoose = require("mongoose");
const Transaction = require("./Transaction");

const budgetSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    period: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    transaction_type: {
      type: String,
      default: "expense",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    spent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

budgetSchema.pre("save", async function (next) {
  try {
    // Find all expense transactions within the budget's time range
    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          user_id: this.user_id,
          category_id: this.category_id,
          transaction_type: "expense",
          date: { $gte: this.period.startDate, $lte: this.period.endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    // Update spent amount if transactions exist
    this.spent = totalSpent.length > 0 ? totalSpent[0].totalSpent : 0;

    next();
  } catch (error) {
    console.error("Error calculating spent amount:", error);
    next(error);
  }
});

module.exports = mongoose.model("Budget", budgetSchema, "budgets");
