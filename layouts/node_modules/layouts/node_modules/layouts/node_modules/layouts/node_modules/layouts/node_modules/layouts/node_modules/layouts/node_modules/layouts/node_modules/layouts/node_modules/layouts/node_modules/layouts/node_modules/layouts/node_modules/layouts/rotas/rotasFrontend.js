const express = require('express');
const router = express.Router();
const frontendController = require('../controladores/controladorFrontend');
const autenticaToken = require('../middlewares/autentica');
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para renderizar a página do catálogo
router.get('/', frontendController.paginaCatalogo);

// Rota para renderizar a página de login
router.get('/login', frontendController.paginaLogin);

// Rota para processar o login
router.post('/login', frontendController.processoLogin);

// Rota para renderizar a página de cadastro
router.get('/cadastro', frontendController.paginaCadastro);

// Rota para processar o cadastro
router.post('/cadastro', frontendController.processoCadastro);

// Rota para renderizar a página de cadastro de livros
router.get('/cadastrolivro', frontendController.cadastroLivro);

// Rota para processar o cadastro de livros com upload de capa
router.post('/cadastrolivro', upload.single('capa'), frontendController.processoCadastroLivro);

// Rota para renderizar a página de pedidos do usuário, requer autenticação
router.get('/pedidos', autenticaToken, frontendController.pedidos);

// Rota para processar a criação de um pedido, requer autenticação
router.post('/criarpedido', autenticaToken, frontendController.processoPedidos);

// Rota para processar a remoção de quantidade de um item no pedido
router.post('/removeritemquant', frontendController.removerQuantidade);

// Rota para processar a finalização de um pedido
router.post('/finalizarpedido', frontendController.finalizarPedido);

// Rota para processar a avaliação de um livro
router.post('/avaliacoes', frontendController.processoAvaliacao);

// Rota para processar o logout
router.post('/logout', frontendController.logout);

// Rota para renderizar a página de detalhes de um livro
router.get('/livros/:id', frontendController.paginaDetalhes);

// Rota para renderizar a página de perfil do usuário
router.get('/editarperfil/:id',frontendController.paginaEditarPerfil)

// Rota para processar a edição do perfil do usuário
router.post('/editarperfil/:id',frontendController.processoEditarPerfil)

module.exports = router;