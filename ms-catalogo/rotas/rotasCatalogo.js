const express = require('express')
const controladorCatalogo = require('../controladores/controladorCatalogo')
const rota = express.Router()
const {GridFSBucket} = require('mongodb');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para listar todos os livros
rota.get('/livros', controladorCatalogo.listarLivros)

// Rota para listar todas as categorias
rota.get('/categorias', controladorCatalogo.listarCategorias)

// Rota para adicionar um novo livro com upload de capa
rota.post('/livros', upload.single('capa'), controladorCatalogo.adicionarLivro)

// Rota para adicionar uma nova categoria
rota.post('/categorias', controladorCatalogo.adiconarCategoria)

// Rota para listar os detalhes de um livro por ID, incluindo avaliações
rota.get('/livros/:livroId', controladorCatalogo.listarLivrosporId)

// Rota para listar os detalhes de um livro por ID
rota.get('/livros/listarpedidos/:livroId', controladorCatalogo.listarLivrosPedidos)

module.exports = rota