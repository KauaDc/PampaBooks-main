const express = require('express');
const authController = require('../controladores/controladorAutenticacao');
const rota = express.Router();

rota.post('/login', authController.login);
rota.post('/registro', authController.registro);
rota.post('/logout',  authController.logout);
  module.exports = rota;