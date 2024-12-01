const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(express.urlencoded({ extended: true })); // Middleware para parsear dados de formulário
app.use(express.json()); // Middleware para parsear JSON

const rotasAvaliacao = require('./rotas/rotasAvaliacao.js')
app.use('/api/avaliacao', rotasAvaliacao) // Define as rotas de avaliação com o prefixo '/api/avaliacao'

mongoose.connect(process.env.MONGO_URI).then(() => {
   console.log('Conectado ao MongoDB') // Mensagem de sucesso ao conectar ao MongoDB
}).catch((erro) => {
   console.log('Erro ao conectar ao MongoDB: ' + erro) // Mensagem de erro ao falhar na conexão com o MongoDB
})

app.listen(process.env.PORTA, () => {
   console.log('Servidor rodando na porta ' + process.env.PORTA) // Mensagem indicando que o servidor está rodando na porta especificada
})