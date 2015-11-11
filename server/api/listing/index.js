'use strict';

var express = require('express');
var controller = require('./listing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', controller.count);

module.exports = router;