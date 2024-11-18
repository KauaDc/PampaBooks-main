const express = require('express');
const authController = require('../controllers/authController');
const verificarToken = require('../helpers/auth');

const rota = express.Router();

rota.post('/login', authController.login);
rota.post('/registro', authController.registro);
rota.get('/validatoken', verificarToken, authController.validaToken);

module.exports = rota;