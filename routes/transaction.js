const path = require('path');
const trxController = require('../controller/trxController');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

router.get('/', trxController.getAllTransaction);
router.get('/:id', trxController.getATransaction);
router.post('/', trxController.addATransaction);
router.delete('/:id', trxController.deleteTransaction);
router.delete('/', trxController.deleteAllTransactions);

module.exports = router