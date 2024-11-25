const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const rotasAvaliacao = require('./rotas/rotasAvaliacao.js')
app.use('/api/avaliacao', rotasAvaliacao)

mongoose.connect(process.env.MONGO_URI).then(() => {
   console.log('Conectado ao MongoDB')
}).catch((erro) => {
   console.log('Erro ao conectar ao MongoDB: ' + erro)
})

app.listen(process.env.PORTA, () => {
   console.log('Servidor rodando na porta ' + process.env.PORTA)
})