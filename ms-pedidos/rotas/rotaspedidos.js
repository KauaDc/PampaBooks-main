const express = require('express');
const router = express.Router();
const pedidoController = require('../controladores/controladorpedidos');

router.post('/criarpedido', pedidoController.criarPedido);

//router.put('/:pedidoId', pedidoController.adicionarLivroPedido);

//router.get('/:pedidoId', pedidoController.obterPedidoPorId);

//router.get('/usuario/:usuarioId', pedidoController.obterPedidosPorUsuario);

//router.delete('/:pedidoId', pedidoController.cancelarPedido);

module.exports = router;