const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
app.use(express.json())

const rotasCatalogo = require('./rotas/rotasCatalogo.js')
app.use('/api/catalogo', rotasCatalogo)

mongoose.connect(process.env.MONGO_URI).then(() => {
   console.log('Conectado ao MongoDB')
}).catch((erro) => {
   console.log('Erro ao conectar ao MongoDB: ' + erro)
})

app.listen(process.env.PORTA, () => {
   console.log('Servidor rodando na porta ' + process.env.PORTA)
})