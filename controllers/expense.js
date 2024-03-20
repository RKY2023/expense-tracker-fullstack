const Expense = require("../models/expense");

const getPage = (req, res, next) => {
  const userData = {};
  res.render("login", {
    userData: userData,
    mode: 'signup',
    error: [],
  });
};

const getExpense = async (req, res, next) => {
  console.log(req.user);
  const expenses = await req.user.getExpenses();
  // const expenses = await Expense.findAll();
  res.render("expense", {
    expenses: expenses || [],
    mode: 'signup',
    error: [],
  });
};

const addExpense = async (req, res, next) => {
  console.log(req.body);
  const { amount, description, category } = req.body;
  const response = await Expense.create({ amount, description, category })
  res.status(201).json(response);  
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const expense = await Expense.findByPk(expenseId);
  res.status(201).json(expense.destroy());
};

module.exports = {
  getPage: getPage,
  getExpense: getExpense,
  addExpense: addExpense,
  deleteExpense: deleteExpense
};
