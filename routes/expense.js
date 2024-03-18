const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/', expenseController.getPage);

router.post('/login', expenseController.postLogin);

// router.get('/blog/comment/:blogId', expenseController.getComment);

// router.post('/blog/comment/:blogId', expenseController.postComment);

module.exports = router;
