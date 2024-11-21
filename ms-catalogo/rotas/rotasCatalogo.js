const express = require('express')
const controladorCatalogo = require('../controladores/controladorCatalogo')
const rota = express.Router()
const {GridFSBucket} = require('mongodb');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


rota.get('/livros', controladorCatalogo.listarLivros)
rota.get('/categorias', controladorCatalogo.listarCategorias)
rota.post('/livros', upload.single('capa'), controladorCatalogo.adicionarLivro)
rota.post('/categorias', controladorCatalogo.adiconarCategoria)


module.exports = rota