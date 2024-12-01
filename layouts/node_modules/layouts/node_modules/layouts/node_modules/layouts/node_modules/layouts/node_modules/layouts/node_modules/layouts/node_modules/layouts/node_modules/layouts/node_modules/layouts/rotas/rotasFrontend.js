const express = require('express');
const router = express.Router();
const frontendController = require('../controladores/controladorFrontend');
const autenticaToken = require('../middlewares/autentica');
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get('/', frontendController.paginaCatalogo);
router.get('/login', frontendController.paginaLogin);
router.post('/login', frontendController.processoLogin);
router.get('/cadastro', frontendController.paginaCadastro);
router.post('/cadastro', frontendController.processoCadastro);
router.get('/cadastrolivro', frontendController.cadastroLivro)
router.post('/cadastrolivro',upload.single('capa'), frontendController.processoCadastroLivro);
router.get('/pedidos',autenticaToken,frontendController.pedidos);
router.post('/criarpedido',autenticaToken,frontendController.processoPedidos);
router.post('/removeritemquant', frontendController.removerQuantidade)
router.post('/finalizarpedido', frontendController.finalizarPedido)
router.post('/avaliacoes',frontendController.processoAvaliacao)
router.post('/logout',frontendController.logout)
router.get('/livros/:id',frontendController.paginaDetalhes)
router.get('/editarperfil/:id',frontendController.paginaEditarPerfil)
router.post('/editarperfil/:id',frontendController.processoEditarPerfil)
module.exports = router;