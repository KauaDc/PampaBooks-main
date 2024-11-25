const express = require('express');
const router = express.Router();
const pedidoController = require('../controladores/controladorpedidos');

router.post('/criarpedido', pedidoController.criarPedido);

router.get('/usuario/:usuarioid/pedidos', pedidoController.listarPedidos);


router.post('/removerquantidade/:pedidoId/:livroId', pedidoController.removerLivroPedidoPorQuantidade);
router.post('/finalizarPedido/:pedidoId', pedidoController.finalizarPedido);
module.exports = router;