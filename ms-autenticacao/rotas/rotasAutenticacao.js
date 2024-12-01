const express = require('express');
const authController = require('../controladores/controladorAutenticacao');
const rota = express.Router();

rota.post('/login', authController.login);
rota.post('/registro', authController.registro);
rota.post('/logout',  authController.logout);
rota.get('/procurarusuarios/:usuarioId', authController.procurarUsuario);
rota.get('/editarperfil/:usuarioid', authController.editarPerfil);
rota.put('/editarperfil/:usuarioid', authController.processoEditarPerfil);
  module.exports = rota;