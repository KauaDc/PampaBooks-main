const express = require('express');
const authController = require('../controladores/controladorAutenticacao');
const rota = express.Router();

// Rota para processar o login
rota.post('/login', authController.login);

// Rota para processar o registro de um novo usuário
rota.post('/registro', authController.registro);

// Rota para processar o logout
rota.post('/logout', authController.logout);

// Rota para procurar um usuário pelo ID
rota.get('/procurarusuarios/:usuarioId', authController.procurarUsuario);

// Rota para renderizar a página de edição de perfil
rota.get('/editarperfil/:usuarioid', authController.editarPerfil);

// Rota para processar a edição de perfil
rota.put('/editarperfil/:usuarioid', authController.processoEditarPerfil);

module.exports = rota;