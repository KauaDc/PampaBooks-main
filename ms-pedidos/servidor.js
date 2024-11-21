const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Pode ser substituído pelo express.json() no Express 4.16+
const pedidosRouter = require('./rotas/rotaspedidos'); // Assegure-se de ter uma pasta `rotas` com um arquivo `pedidos.js`
require('dotenv').config()

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao banco de dados MongoDB'))
  .catch(err => console.error('Não foi possível conectar ao banco de dados MongoDB', err));

app.use(bodyParser.json()); // Ou app.use(express.json());



// Rotas para pedidos
app.use('/api/pedidos', pedidosRouter);

// Inicialização do servidor
const PORT = process.env.PORTA 
app.listen(PORT, () => {
    console.log(`Servidor de Pedidos executando na porta ${PORT}`);
});