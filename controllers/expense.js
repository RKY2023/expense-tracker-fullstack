const Expense = require("../models/expense");
const sequelize = require("../util/database");
const { QueryTypes } = require('sequelize');
const S3Services = require("../services/S3Services");
const UserServices = require("../services/userservices");
const Transaction = require("../models/transaction");

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
  const limit = 10;
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
