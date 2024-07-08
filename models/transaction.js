const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  transactionIdRef: {
    type: String,
    required: true,
  },
  chequeRefNo: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  debit: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Expense', expenseSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Transaction = sequelize.define('transaction', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   date: Sequelize.DATE,
//   transactionIdRef: Sequelize.STRING,
//   chequeRefNo: Sequelize.STRING,
//   credit: Sequelize.DOUBLE,
//   debit: Sequelize.DOUBLE,
//   balance: Sequelize.DOUBLE,
//   category: {
//     type: Sequelize.STRING,
//   }
// });

// module.exports = Transaction;