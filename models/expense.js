const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId:  {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Expense', expenseSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expense', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   description: Sequelize.STRING,
//   amount: Sequelize.DOUBLE,
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   }  
// });

// module.exports = Expense;