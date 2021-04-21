const path = require('path');
const bookController = require('../controller/bookController');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

// http://localhost:3000/api/book?sort=name, {FIND ALL book, also sort them}
// filter: price, area, isFreeGiveAway, Genre
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getABook);
router.post('/', bookController.addABook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.delete('/', bookController.deleteAllBooks);

module.exports = router