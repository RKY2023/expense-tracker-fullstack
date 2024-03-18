const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/', expenseController.getPage);

router.post('/user/signup', expenseController.postUserSignup);

module.exports = router;
