const express = require("express");
const cors = require('cors');
const path = require('path');
require("dotenv").config();

const app = express();
const userRoutes = require('./routes/userRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Páginas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html')));
app.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'cadastro.html')));

// Rotas de usuário
app.use('/api/usuarios', userRoutes);
app.use('/api/pacientes', pacienteRoutes);

app.listen(process.env.PORT || 3000, () => console.log('App is running!'));
