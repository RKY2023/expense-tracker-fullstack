const Expense = require("../models/expense");
const sequelize = require("../util/database");

const getPage = (req, res, next) => {
  res.render("login", {
    mode: 'signup',
    error: [],
  });
};

const getExpense = async (req, res, next) => {
  // const expenses = await req.user.getExpenses();
  // const expenses = await Expense.findAll();
  console.log('tttt');
  res.render("expense", {
    expenses: [],
  });
};

const getExpenseData = async (req, res, next) => {
  // console.log('exp',req.user);
  const expenses = await req.user.getExpenses();
  // const expenses = await Expense.findAll();
  // console.log(expenses);
  res.render("expenseData", {
    expenses: expenses || [],
  });
};

const addExpense = async (req, res, next) => {
  console.log('aa',req.usera, req.body);
  const { amount, description, category } = req.body;
  // Expense.create({ amount, description, category })
  let expense;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    expense = await req.user.createExpense({ amount, description, category }, { transaction });
    await req.user.update({totalExpense: parseFloat(req.user.totalExpense) + parseFloat(expense.amount)}, { transaction });
    await transaction.commit();
  } catch(err) {
    if (transaction) await transaction.rollback();
  }
  const expenses = [];
  expenses.push(expense);
  if( expense.id ){
    res.render("expenseDataRow",{
      expenses: expenses
    })
  } else{
    res.status(404).json(expense);
  }
    
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  let transaction;
  let isDestroyed;
  try {
    transaction = await sequelize.transaction();
    isDestroyed = await Expense.destroy({ where: { id: expenseId, userId: req.user.id }}, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
  }
  if( isDestroyed == 1) {
    res.status(201).json({ success: { message: 'Expense deleted' }});
  } else {
    res.status(201).json({ error: { message: 'delete Failed' }});
  }
};

module.exports = {
  getPage: getPage,
  getExpense: getExpense,
  addExpense: addExpense,
  deleteExpense: deleteExpense,
  getExpenseData: getExpenseData
};
