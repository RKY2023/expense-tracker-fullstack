const Expense = require("../models/expense");
const User = require("../models/user");

const getExpenses = (req, res) => {
    // const expenses = Expense.find({ })

    return Expense.find({ userId: req.user._id})
}

module.exports = {
    getExpenses
}