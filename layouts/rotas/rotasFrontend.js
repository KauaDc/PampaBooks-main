const express = require('express');
const router = express.Router();
const frontendController = require('../controladores/controladorFrontend');
const autenticaToken = require('../middleware/autentica');

router.get('/pedidos',autenticaToken,frontendController.pedidos);
module.exports = router;