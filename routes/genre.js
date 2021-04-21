const path = require('path');
const genreController = require('../controller/genreController');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();


router.post('/', genreController.addGenre);
router.post('/bulk', genreController.bulkInsert);
router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenre);
router.put('/:id', genreController.updateGenre);
router.delete('/', genreController.deleteAllGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router