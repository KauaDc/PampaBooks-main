require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rotasAutenticacao = require('./rotas/rotasAutenticacao');
const cookieParser = require('cookie-parser');


const app = express();


app.use(bodyParser.json()); // Middleware para parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para parsear dados de formulário
app.use(cookieParser());
const corsOptions = {
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {
  console.log('Conectado ao MongoDB com sucesso!');
});

mongoose.connection.on('error', (err) => {
  console.log('Erro ao conectar ao MongoDB:', err);
});

app.use('/api/autenticacao', rotasAutenticacao);

const PORT = process.env.PORTA;
app.listen(PORT, () => {
  console.log(`Servidor de Autenticação rodando na porta ${PORT}`);
});