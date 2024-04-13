const express = require('express')
const router = express.Router();
const twitterActions = require('./twitterActions')

router.use('/twitterActions', twitterActions);

module.exports = router