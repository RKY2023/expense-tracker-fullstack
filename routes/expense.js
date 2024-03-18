const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/', expenseController.getPage);

// router.post('/user/login', expenseController.postUserLogin);

// router.post('/user/signup', expenseController.postUserSignup);

router.post('/user/test', expenseController.postTest);

module.exports = router;
