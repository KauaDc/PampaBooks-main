const express = require('express');
const router = express.Router();
const pedidoController = require('../controladores/controladorpedidos');

/**
 * @swagger
 * /criarpedido:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioid:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     livro:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       500:
 *         description: Erro ao criar pedido
 */
router.post('/criarpedido', pedidoController.criarPedido);

/**
 * @swagger
 * /usuario/{usuarioid}/pedidos:
 *   get:
 *     summary: Lista os pedidos de um usuário específico
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: usuarioid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 *       404:
 *         description: Nenhum pedido encontrado para este usuário
 *       500:
 *         description: Erro ao listar pedidos
 */
router.get('/usuario/:usuarioid/pedidos', pedidoController.listarPedidos);

/**
 * @swagger
 * /removerquantidade/{pedidoId}/{livroId}:
 *   post:
 *     summary: Remove uma quantidade específica de um livro de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *       - in: path
 *         name: livroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantidade do item ajustada ou removida com sucesso
 *       404:
 *         description: Pedido ou item não encontrado
 *       500:
 *         description: Erro ao remover a quantidade do item
 */
router.post('/removerquantidade/:pedidoId/:livroId', pedidoController.removerLivroPedidoPorQuantidade);

/**
 * @swagger
 * /finalizarPedido/{pedidoId}:
 *   post:
 *     summary: Finaliza um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido finalizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao finalizar o pedido
 */
router.post('/finalizarPedido/:pedidoId', pedidoController.finalizarPedido);

module.exports = router;