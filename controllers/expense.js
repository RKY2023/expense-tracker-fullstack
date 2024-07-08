const Expense = require("../models/expense");
const User = require("../models/user");
// const sequelize = require("../util/database");
// const { QueryTypes } = require('sequelize');
const S3Services = require("../services/S3Services");
const UserServices = require("../services/userservices");
// const Transaction = require("../models/transaction");

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
  // let expenses;
  let pages = 0;
  // const limit = 10;
  let page = 0;
  // if (req.body && req.body.page) {
  //   page = req.body.page;
  //   const offset = page * limit;
  //   expenses = await req.user.getExpenses({ limit: limit, offset: offset });
  //   pages = req.body.pages;
  // } else {
  //   expenseCount = await req.user.getExpenses({
  //     attributes: [
  //         [sequelize.fn("COUNT", sequelize.col("id")), "expenseCount"]
  //     ]
  //   });
  //   expenses = await req.user.getExpenses({ limit: limit, offset: 0 });
  //   pages = Math.ceil(expenseCount[0].dataValues.expenseCount / limit);
  // }
  const expenses = await Expense.find({});
  // console.log(pages);
  console.log(expenses);
  res.render("expenseData", {
    expenses: expenses || [],
    pages,
    page: page,
  });
};

const addExpense = async (req, res, next) => {
  // console.log("aa", req.usera, req.body);
  const { amount, description, category } = req.body;
  let expense;
  // let transaction;
  try {
    // transaction = await sequelize.transaction();
    expense = Expense.create(
      { amount, description, category, userId: req.user },
    )
    let user = await User.findOne({ _id: req.user._id})
    user.totalExpense = user.totalExpense + parseFloat(amount)
    user.save();
  } catch (err) {
    // if (transaction) await transaction.rollback();
  }
  // const expenses = [];
  // console.log(expense);
  // expenses.push(expense);
  // if (expense._id) {
  //   res.render("expenseDataRow", {
  //     expenses: expenses,
  //   });
  // } else {
  //   res.status(404).json(expense);
  // }
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  // let transaction;
  let isDestroyed;
  try {
    // transaction = await sequelize.transaction();
    const expense = await Expense.findOne({ _id: expenseId });
    const user = await User.findOne({ _id: req.user._id });
    user.totalExpense = user.totalExpense - expense.amount;
    user.save();
    isDestroyed = await Expense.deleteOne({ _id: expenseId });
    console.log('des', isDestroyed);
    // await transaction.commit();
  } catch (err) {
    // await transaction.rollback();
  }
  if (isDestroyed.acknowledged) {
    res.status(201).json({ success: { message: "Expense deleted" } });
  } else {
    res.status(201).json({ error: { message: "delete Failed" } });
  }
};

const reportExpense = async (req, res, next) => {
  const transactions = await Transaction.findAll({ where: { userId: 1 }, order: [['date', 'DESC']]});
  const t_yr = await sequelize.query("SELECT DISTINCT YEAR(date) AS year FROM `transactions` WHERE userId =1", { type: QueryTypes.SELECT });
  const t_mnyr = await sequelize.query("SELECT DISTINCT YEAR(date) AS year, MONTH(date) AS month FROM `transactions` WHERE userId =1 order by year desc, month desc", { type: QueryTypes.SELECT });
  console.log(t_yr, t_mnyr);
  console.log(transactions[0].date);
  res.render("reportExpense/reportExpense", {
    transactions: transactions || [],
  });
};

const download = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user._id;
    const timestamp = Math.floor(new Date("2012.08.10").getTime() / 1000);
    const filename = `Expense_${userId}/${timestamp}_Expenses.txt`;
    console.log(filename);
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", sucess: false, error: err });
  }
};

const csvUpload = async (req, res, next) => {
  let trans;
  try {
    trans = await sequelize.transaction();
    // console.log(req.body);
    if( req.body.data) {
      const data = JSON.parse(req.body.data);
      console.log(data);
      
      for ( let i = 0; i< data.length; i++) {
        req.user.createTransaction(data[i]);
      }
      
    }
    await trans.commit();
    res.status(200).json({ success: true });

  } catch (err) {
    console.log(err);
    trans.rollback();
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
  csvUpload,
};
