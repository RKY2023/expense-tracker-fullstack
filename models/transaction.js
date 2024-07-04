const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Transaction = sequelize.define('transaction', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  date: Sequelize.DATE,
  transactionIdRef: Sequelize.STRING,
  chequeRefNo: Sequelize.STRING,
  credit: Sequelize.DOUBLE,
  debit: Sequelize.DOUBLE,
  balance: Sequelize.DOUBLE,
  category: {
    type: Sequelize.STRING,
  }
});

module.exports = Transaction;