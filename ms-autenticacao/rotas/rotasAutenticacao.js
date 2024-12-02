const express = require('express');
const authController = require('../controladores/controladorAutenticacao');
const rota = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Processa o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Senha inválida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao fazer login
 */
rota.post('/login', authController.login);

/**
 * @swagger
 * /registro:
 *   post:
 *     summary: Processa o registro de um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Email e senha são obrigatórios
 *       500:
 *         description: Erro ao registrar usuário
 */
rota.post('/registro', authController.registro);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Processa o logout do usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
rota.post('/logout', authController.logout);

/**
 * @swagger
 * /procurarusuarios/{usuarioId}:
 *   get:
 *     summary: Procura um usuário pelo ID
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar detalhes do usuário
 */
rota.get('/procurarusuarios/:usuarioId', authController.procurarUsuario);

/**
 * @swagger
 * /editarperfil/{usuarioid}:
 *   get:
 *     summary: Renderiza a página de edição de perfil
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: usuarioid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do usuário para edição
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar detalhes do usuário
 */
rota.get('/editarperfil/:usuarioid', authController.editarPerfil);

/**
 * @swagger
 * /editarperfil/{usuarioid}:
 *   put:
 *     summary: Processa a edição de perfil
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: usuarioid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar dados do usuário
 */
rota.put('/editarperfil/:usuarioid', authController.processoEditarPerfil);

module.exports = rota;