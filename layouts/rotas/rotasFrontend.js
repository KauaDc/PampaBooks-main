const express = require('express');
const router = express.Router();
const frontendController = require('../controladores/controladorFrontend');
const autenticaToken = require('../middleware/autentica');

router.get('/', frontendController.paginaCatalogo)
router.get('/login', frontendController.paginaLogin);
router.post('/login', frontendController.processoLogin);
router.get('/cadastro', frontendController.paginaCadastro);
router.post('/cadastro', frontendController.processoCadastro);
router.get('/cadastrolivro', frontendController.cadastroLivro)
router.post('/cadastrolivro', frontendController.processoCadastroLivro);
router.get('/pedidos',autenticaToken,frontendController.pedidos);
module.exports = router;