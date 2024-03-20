const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/login', userController.loginAPI);

router.post('/signup', userController.signupAPI);

module.exports = router;
