const path = require('path');

const express = require('express');

const passwordController = require('../controllers/password');

const router = express.Router();

router.get('/forgotpassword', passwordController.forgotPassword);

router.post('/sendmail', passwordController.forgotPasswordMail);

module.exports = router;
