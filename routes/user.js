const path = require('path');

const express = require('express');

const expenseController = require('../controllers/user');

const router = express.Router();

router.post('/login', expenseController.login);

router.post('/signup', expenseController.signup);

module.exports = router;
