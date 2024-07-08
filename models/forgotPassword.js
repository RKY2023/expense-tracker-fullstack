const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const forgotpasswordrequestsSchema = new Schema({
  isactive: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model('Forgotpasswordrequests', forgotpasswordrequestsSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
//   id: {
//     type: Sequelize.STRING,
//     primaryKey: true
//   },
//   isactive: Sequelize.BOOLEAN
// });

// module.exports = ForgotPasswordRequests;