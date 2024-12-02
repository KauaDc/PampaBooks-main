require('dotenv').config(); // Carrega variáveis de ambiente a partir de um arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rotasAutenticacao = require('./rotas/rotasAutenticacao');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(bodyParser.json()); // Middleware para parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para parsear dados de formulário
app.use(cookieParser()); // Middleware para parsear cookies


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
  apis: ['./rotas/rotasAutenticacao.js'], // Caminho para os arquivos de rota onde você irá adicionar os comentários para documentação
  };
  
  // Configurar as especificações do Swagger
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  




// Conecta ao MongoDB usando a URI fornecida nas variáveis de ambiente
mongoose.connect(process.env.MONGO_URI);

// Evento disparado quando a conexão com o MongoDB é estabelecida com sucesso
mongoose.connection.on('connected', () => {
  console.log('Conectado ao MongoDB com sucesso!');
});

// Evento disparado quando ocorre um erro na conexão com o MongoDB
mongoose.connection.on('error', (err) => {
  console.log('Erro ao conectar ao MongoDB:', err);
});

app.use('/api/autenticacao', rotasAutenticacao);

const PORT = process.env.PORTA;
app.listen(PORT, () => {
  console.log(`Servidor de Autenticação rodando na porta ${PORT}`);
});