const path = require('path');
const userController = require('../controller/userController');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

// // http://localhost:3000/api/user?sort=name, {FIND ALL user, also sort them}
router.get('/', userController.getAllUser);

router.post('/', userController.createUser);

// http://localhost:3000/api/user/:id
router.get('/:id', userController.getAUser);

// // http://localhost:3000/api/user/:id
router.put('/:id', userController.updateUser);

// // http://localhost:3000/api/user
router.delete('/:id', userController.deleteUser);

// // http://localhost:3000/api/user
router.delete('/', userController.deleteAllNonAdminUser);

module.exports = router