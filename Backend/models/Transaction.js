const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
        enum : ['expense','income'],
        required: true,
    },
},{
    timestamps: true
});


module.exports = mongoose.model("transaction", transactionSchema, "transactions");