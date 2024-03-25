const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', expenseController.getPage);

router.get('/expense', expenseController.getExpense);

router.get('/expense/expenseData', userController.authenticate, expenseController.getExpenseData);

router.post('/expense/addExpense', userController.authenticate, expenseController.addExpense);

router.get('/expense/deleteExpense/:expenseId', userController.authenticate, expenseController.deleteExpense);

router.get('/expense/report', expenseController.reportExpense);

module.exports = router;
