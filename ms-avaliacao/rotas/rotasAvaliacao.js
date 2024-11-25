const express = require('express')
const controladorAvaliacao = require('../controladores/controladorAvaliacao')
const rota = express.Router()

rota.post('/novaavaliacao', controladorAvaliacao.adicionarAvaliacao)
rota.get('/:livroId', controladorAvaliacao.listarAvaliacoes)

module.exports = rota