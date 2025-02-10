const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category_type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "User",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Category", categorySchema, "categories");
