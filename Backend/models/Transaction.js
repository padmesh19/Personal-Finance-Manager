const mongoose = require("mongoose");
const Budget = require("./Budget");

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    transaction_type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.post("save", async function (doc) {
  try {
    if (doc.transaction_type === "expense") {
      const BudgetModel = mongoose.model("Budget"); // Ensure we access the correct model

      const budget = await BudgetModel.findOne({
        user_id: doc.user_id,
        category_id: doc.category_id,
        "period.startDate": { $lte: doc.date },
        "period.endDate": { $gte: doc.date },
      });

      if (budget) {
        budget.spent += doc.amount;
        await budget.save();
      } else {
        console.warn("No matching budget found for the transaction.");
      }
    }
  } catch (error) {
    console.error("Error updating budget spent:", error);
  }
});


// 🔹 Adjust Budget `spent` when a transaction is updated
transactionSchema.post("findOneAndUpdate", async function (doc) {
  try {
    if (doc.transaction_type === "expense") {
      // Get the previous transaction data
      const original = await this.model.findOne(this.getQuery());

      if (original) {
        const amountDifference = doc.amount - original.amount;

        await Budget.findOneAndUpdate(
          {
            user_id: doc.user_id,
            category_id: doc.category_id,
            "period.startDate": { $lte: doc.date },
            "period.endDate": { $gte: doc.date },
          },
          { $inc: { spent: amountDifference } } // Adjust spent amount
        );
      }
    }
  } catch (error) {
    console.error(
      "Error updating budget spent after transaction update:",
      error
    );
  }
});

// 🔹 Reduce Budget `spent` when a transaction is deleted
transactionSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (doc && doc.transaction_type === "expense") {
      const BudgetModel = mongoose.model("Budget"); // Ensure we access the correct model

      const budget = await BudgetModel.findOne({
        user_id: doc.user_id,
        category_id: doc.category_id,
        "period.startDate": { $lte: doc.date },
        "period.endDate": { $gte: doc.date },
      });

      if (budget) {
        budget.spent -= doc.amount;
        await budget.save();
      } else {
        console.warn("No matching budget found for the deleted transaction.");
      }
    }
  } catch (error) {
    console.error("Error updating budget spent after transaction delete:", error);
  }
});


module.exports = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);
