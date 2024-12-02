const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.urlencoded({ extended: true })); // Middleware para parsear dados de formulário
app.use(express.json()); // Middleware para parsear JSON

const rotasAvaliacao = require('./rotas/rotasAvaliacao.js')
app.use('/api/avaliacao', rotasAvaliacao) // Define as rotas de avaliação com o prefixo '/api/avaliacao'

// Carregar e configurar a documentação OpenAPI
const swaggerOptions = {
   swaggerDefinition: {
   openapi: '3.0.0',
   info: {
   title: 'API de Avaliações',
   version: '1.0.0',
   description: 'Documentação da API de Avaliações usando OpenAPI',
   },
   servers: [
   {
   url: `http://localhost:${process.env.PORTA}`
   }
   ],
   },
   apis: ['./rotas/rotasAvaliacao.js'], // Caminho para os arquivos de rota onde você irá adicionar os comentários para documentação
   };
   
   // Configurar as especificações do Swagger
   const swaggerDocs = swaggerJsdoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   







mongoose.connect(process.env.MONGO_URI).then(() => {
   console.log('Conectado ao MongoDB') // Mensagem de sucesso ao conectar ao MongoDB
}).catch((erro) => {
   console.log('Erro ao conectar ao MongoDB: ' + erro) // Mensagem de erro ao falhar na conexão com o MongoDB
})

app.listen(process.env.PORTA, () => {
   console.log('Servidor rodando na porta ' + process.env.PORTA) // Mensagem indicando que o servidor está rodando na porta especificada
})