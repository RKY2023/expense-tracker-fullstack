const Expense = require("../models/expense");
const sequelize = require("../util/database");
const S3Services = require("../services/S3Services");
const UserServices = require("../services/userservices");

const getPage = (req, res, next) => {
  res.render("login", {
    mode: "signup",
    error: [],
  });
};

const getExpense = async (req, res, next) => {
  // const expenses = await req.user.getExpenses();
  // const expenses = await Expense.findAll();
  res.render("expense", {
    expenses: [],
  });
};

const getExpenseData = async (req, res, next) => {
  console.log("exp", req.body);
  let expenses;
  let pages = 0;
  const limit = 2;
  let page = 0;
  if (req.body && req.body.page) {
    page = req.body.page;
    const offset = page * limit;
    expenses = await req.user.getExpenses({ limit: limit, offset: offset });
    pages = req.body.pages;
  } else {
    expenseCount = await req.user.getExpenses({
      attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "expenseCount"]
      ]
    });
    expenses = await req.user.getExpenses({ limit: limit, offset: 0 });
    pages = Math.ceil(expenseCount[0].dataValues.expenseCount / limit);
  }
  // const expenses = await Expense.findAll();
  console.log(pages);
  res.render("expenseData", {
    expenses: expenses || [],
    pages,
    page: page,
  });
};

const addExpense = async (req, res, next) => {
  console.log("aa", req.usera, req.body);
  const { amount, description, category } = req.body;
  // Expense.creat e({ amount, description, category })
  let expense;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    expense = await req.user.createExpense(
      { amount, description, category },
      { transaction }
    );
    await req.user.update(
      {
        totalExpense:
          parseFloat(req.user.totalExpense) + parseFloat(expense.amount),
      },
      { transaction }
    );
    await transaction.commit();
  } catch (err) {
    if (transaction) await transaction.rollback();
  }
  const expenses = [];
  expenses.push(expense);
  if (expense.id) {
    res.render("expenseDataRow", {
      expenses: expenses,
    });
  } else {
    res.status(404).json(expense);
  }
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  let transaction;
  let isDestroyed;
  try {
    transaction = await sequelize.transaction();
    isDestroyed = await Expense.destroy(
      { where: { id: expenseId, userId: req.user.id } },
      { transaction }
    );
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
  }
  if (isDestroyed == 1) {
    res.status(201).json({ success: { message: "Expense deleted" } });
  } else {
    res.status(201).json({ error: { message: "delete Failed" } });
  }
};

const reportExpense = (req, res, next) => {
  const expenses = [];
  res.render("reportExpense/reportExpense", {
    expenses: expenses || [],
  });
};

const download = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const timestamp = Math.floor(new Date("2012.08.10").getTime() / 1000);
    const filename = `Expense_${userId}/${timestamp}_Expenses.txt`;
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", sucess: false, error: err });
  }
};

module.exports = {
  getPage: getPage,
  getExpense: getExpense,
  addExpense: addExpense,
  deleteExpense: deleteExpense,
  getExpenseData: getExpenseData,
  reportExpense,
  download,
};
