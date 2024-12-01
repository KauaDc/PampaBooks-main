const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
app.use(express.json()) // Middleware para parsear JSON

const rotasCatalogo = require('./rotas/rotasCatalogo.js')
app.use('/api/catalogo', rotasCatalogo) // Define as rotas de catálogo com o prefixo '/api/catalogo'

mongoose.connect(process.env.MONGO_URI).then(() => {
   console.log('Conectado ao MongoDB') // Mensagem de sucesso ao conectar ao MongoDB
}).catch((erro) => {
   console.log('Erro ao conectar ao MongoDB: ' + erro) // Mensagem de erro ao falhar na conexão com o MongoDB
})

app.listen(process.env.PORTA, () => {
   console.log('Servidor rodando na porta ' + process.env.PORTA) // Mensagem indicando que o servidor está rodando na porta especificada
})