const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

const getLeadersboard = async (req, res, next) => {
    const expenses = await Expense.findAll();
    const users = await User.findAll();
    const totalExpense = {};
    expenses.forEach(e => {
        if(totalExpense[e.userId]) {
            totalExpense[e.userId] += e.amount;
        }
        else 
            totalExpense[e.userId] = e.amount;
    });
    const leaderboard = [];
    users.forEach(u => {
        leaderboard.push({ userId: u.id, userName: u.name, totalExpense: totalExpense[u.id] || 0})
    })
    leaderboard.sort((a,b) => { b.totalExpense - a.totalExpense });
    // return res.status(200).json(leaderboard);
    res.render("leadersboard", {
        leaderboard
    });
};

module.exports = {
    getLeadersboard: getLeadersboard,
};