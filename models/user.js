const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
    default: false,
    required: true,
  },
  totalExpense: {
    type: Number,
    default: 0,
    required: true,
  },
}
// ,{strict: true}
);

module.exports = mongoose.model('User', userSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: Sequelize.STRING,
//   ispremiumuser: Sequelize.BOOLEAN,
//   totalExpense: {
//     type: Sequelize.DOUBLE,
//     defaultValue: 0
//   }
// });

// module.exports = User;