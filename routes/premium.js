const path = require('path');

const express = require('express');

const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/leaderboard', premiumController.getLeadersboard);

module.exports = router;
