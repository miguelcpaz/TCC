const express = require('express');
const { registerPaciente, getPacientes} = require('../controllers/pacienteController');

const router = express.Router();

// Cadastro
router.post('/register', registerPaciente);
router.get('/get', getPacientes);
module.exports = router;
