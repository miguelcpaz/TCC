const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Cadastro
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
