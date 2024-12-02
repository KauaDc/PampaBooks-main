const express = require('express')
const controladorAvaliacao = require('../controladores/controladorAvaliacao')
const rota = express.Router()

/**
* @swagger
* components:
*   schemas:
*     Avaliacao:
*       type: object
*       required:
*         - livroId
*         - comentario
*         - nota
*       properties:
*         id:
*           type: string
*           description: ID gerado automaticamente pelo MongoDB
*         livroId:
*           type: string
*           description: ID do livro sendo avaliado
*         comentario:
*           type: string
*           description: Comentário da avaliação
*         nota:
*           type: number
*           description: Nota da avaliação (1 a 5)
*/

/**
* @swagger
* tags:
*   name: Avaliacoes
*   description: API para gerenciar avaliações
*/
/**
* @swagger
* /api/avaliacao/novaavaliacao:
*   post:
*     summary: Adiciona uma nova avaliação
*     tags: [Avaliacoes]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Avaliacao'
*     responses:
*       201:
*         description: Avaliação adicionada com sucesso
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Avaliacao'
*       400:
*         description: Erro na requisição
*       500:
*         description: Erro interno do servidor
*/
/**
* @swagger
* /api/avaliacao/{livroId}:
*   get:
*     summary: Lista todas as avaliações para um livro
*     tags: [Avaliacoes]
*     parameters:
*       - in: path
*         name: livroId
*         schema:
*           type: string
*         required: true
*         description: ID do livro
*     responses:
*       200:
*         description: Lista de avaliações
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Avaliacao'
*       404:
*         description: Livro não encontrado
*       500:
*         description: Erro interno do servidor
*/


// Rota para adicionar uma nova avaliação
rota.post('/novaavaliacao', controladorAvaliacao.adicionarAvaliacao)

// Rota para listar avaliações de um livro
rota.get('/:livroId', controladorAvaliacao.listarAvaliacoes)

module.exports = rota