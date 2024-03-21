const path = require('path');

const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchase');

const userController = require('../controllers/user');

router.get('/purchase/premium', userController.authenticate, purchaseController.purchasePremium);

router.get('/purchase/updateTransaction', userController.authenticate, purchaseController.purchasePremium);

module.exports = router;
