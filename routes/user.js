const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/login', userController.login);

router.get('/signup', userController.signup);

module.exports = router;
