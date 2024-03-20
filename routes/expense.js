const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/', expenseController.getPage);

router.get('/expense', userController.authenticate, expenseController.getExpense);

router.post('/expense/addExpense', expenseController.addExpense);

router.get('/expense/deleteExpense/:expenseId', expenseController.deleteExpense);

module.exports = router;
