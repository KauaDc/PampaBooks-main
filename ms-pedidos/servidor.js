const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Pode ser substituído pelo express.json() no Express 4.16+
const pedidosRouter = require('./rotas/rotaspedidos'); // Assegure-se de ter uma pasta `rotas` com um arquivo `pedidos.js`
require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();



// Configuração do Swagger
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
  apis: ['./rotas/rotaspedidos.js'], // Caminho para os arquivos de rota onde você irá adicionar os comentários para documentação
  };
  
  // Configurar as especificações do Swagger
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao banco de dados MongoDB')) // Mensagem de sucesso ao conectar ao MongoDB
  .catch(err => console.error('Não foi possível conectar ao banco de dados MongoDB', err)); // Mensagem de erro ao falhar na conexão com o MongoDB

app.use(bodyParser.json()); // Ou app.use(express.json()); Middleware para parsear JSON

// Rotas para pedidos
app.use('/api/pedidos', pedidosRouter); // Define as rotas de pedidos com o prefixo '/api/pedidos'

// Inicialização do servidor
const PORT = process.env.PORTA;
app.listen(PORT, () => {
    console.log(`Servidor de Pedidos executando na porta ${PORT}`); // Mensagem indicando que o servidor está rodando na porta especificada
});