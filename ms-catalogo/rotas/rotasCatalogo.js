const express = require('express');
const controladorCatalogo = require('../controladores/controladorCatalogo');
const rota = express.Router();
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Catálogo]
 *     responses:
 *       200:
 *         description: Lista de livros
 *       500:
 *         description: Erro ao listar livros
 */
rota.get('/livros', controladorCatalogo.listarLivros);

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Catálogo]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *       500:
 *         description: Erro ao listar categorias
 */
rota.get('/categorias', controladorCatalogo.listarCategorias);

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Adiciona um novo livro com upload de capa
 *     tags: [Catálogo]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               capa:
 *                 type: string
 *                 format: binary
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Livro adicionado com sucesso
 *       500:
 *         description: Erro ao adicionar livro
 */
rota.post('/livros', upload.single('capa'), controladorCatalogo.adicionarLivro);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Adiciona uma nova categoria
 *     tags: [Catálogo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria adicionada com sucesso
 *       500:
 *         description: Erro ao adicionar categoria
 */
rota.post('/categorias', controladorCatalogo.adiconarCategoria);

/**
 * @swagger
 * /livros/{livroId}:
 *   get:
 *     summary: Lista os detalhes de um livro por ID, incluindo avaliações
 *     tags: [Catálogo]
 *     parameters:
 *       - in: path
 *         name: livroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Detalhes do livro
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro ao buscar detalhes do livro
 */
rota.get('/livros/:livroId', controladorCatalogo.listarLivrosporId);

/**
 * @swagger
 * /livros/listarpedidos/{livroId}:
 *   get:
 *     summary: Lista os detalhes de um livro por ID
 *     tags: [Catálogo]
 *     parameters:
 *       - in: path
 *         name: livroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Detalhes do livro
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro ao buscar detalhes do livro
 */
rota.get('/livros/listarpedidos/:livroId', controladorCatalogo.listarLivrosPedidos);

module.exports = rota;