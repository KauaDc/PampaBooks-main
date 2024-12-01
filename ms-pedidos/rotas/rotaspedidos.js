const express = require('express');
const router = express.Router();
const pedidoController = require('../controladores/controladorpedidos');

// Rota para criar um novo pedido
router.post('/criarpedido', pedidoController.criarPedido);

// Rota para listar os pedidos de um usuário específico
router.get('/usuario/:usuarioid/pedidos', pedidoController.listarPedidos);

// Rota para remover uma quantidade específica de um livro de um pedido
router.post('/removerquantidade/:pedidoId/:livroId', pedidoController.removerLivroPedidoPorQuantidade);

// Rota para finalizar um pedido
router.post('/finalizarPedido/:pedidoId', pedidoController.finalizarPedido);

module.exports = router;