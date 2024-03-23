const path = require('path');

const express = require('express');

const passwordController = require('../controllers/password');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/forgotpassword', passwordController.forgotPassword);

router.post('/sendmail', userController.authenticate, passwordController.forgotPasswordMail);

router.post('/resetpassword/:resetId', passwordController.resetPassword);

module.exports = router;
