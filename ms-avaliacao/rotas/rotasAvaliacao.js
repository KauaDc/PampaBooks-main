const express = require('express')
const controladorAvaliacao = require('../controladores/controladorAvaliacao')
const rota = express.Router()

// Rota para adicionar uma nova avaliação
rota.post('/novaavaliacao', controladorAvaliacao.adicionarAvaliacao)

// Rota para listar avaliações de um livro
rota.get('/avaliacoes/:livroId', controladorAvaliacao.listarAvaliacoes)

module.exports = rota