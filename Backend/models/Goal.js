const mongoose = require('mongoose');


const goalSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
    name: {
        type: String,
        required: true,
  },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: Number,
        required: true,
  },
    deadline: {
        type: Date,
        required: true,
  },
    status: {
        type: String,
        required: true,
        enum: ["in-progress", "completed"],
        default: "in-progress",
    },
}, {timestamps: true});

module.exports = mongoose.model("Goal", goalSchema, "goals");