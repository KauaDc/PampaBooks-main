const express = require('express');
const authController = require('../controladores/controladorAutenticacao');
const verificarToken = require('../middlewares/autenticaToken');
const rota = express.Router();

rota.post('/login', authController.login);
rota.post('/registro', authController.registro);
  module.exports = rota;