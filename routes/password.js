const path = require('path');

const express = require('express');

const passwordController = require('../controllers/password');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/forgotpassword', passwordController.forgotPassword);

router.post('/sendmail', userController.authenticate, passwordController.forgotPasswordMail);

router.get('/resetpassword/:resetId', passwordController.resetPassword);

router.post('/updatepassword', passwordController.updatePassword);

module.exports = router;
