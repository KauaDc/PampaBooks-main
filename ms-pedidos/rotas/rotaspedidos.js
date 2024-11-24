const express = require('express');
const router = express.Router();
const pedidoController = require('../controladores/controladorpedidos');

router.post('/criarpedido', pedidoController.criarPedido);

router.get('/usuario/:usuarioid/pedidos', pedidoController.listarPedidos);

//router.get('/usuario/:usuarioId', pedidoController.obterPedidosPorUsuario);

//router.delete('/:pedidoId', pedidoController.cancelarPedido);

module.exports = router;