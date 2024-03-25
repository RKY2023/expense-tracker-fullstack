const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  isactive: Sequelize.BOOLEAN
});

module.exports = ForgotPasswordRequests;