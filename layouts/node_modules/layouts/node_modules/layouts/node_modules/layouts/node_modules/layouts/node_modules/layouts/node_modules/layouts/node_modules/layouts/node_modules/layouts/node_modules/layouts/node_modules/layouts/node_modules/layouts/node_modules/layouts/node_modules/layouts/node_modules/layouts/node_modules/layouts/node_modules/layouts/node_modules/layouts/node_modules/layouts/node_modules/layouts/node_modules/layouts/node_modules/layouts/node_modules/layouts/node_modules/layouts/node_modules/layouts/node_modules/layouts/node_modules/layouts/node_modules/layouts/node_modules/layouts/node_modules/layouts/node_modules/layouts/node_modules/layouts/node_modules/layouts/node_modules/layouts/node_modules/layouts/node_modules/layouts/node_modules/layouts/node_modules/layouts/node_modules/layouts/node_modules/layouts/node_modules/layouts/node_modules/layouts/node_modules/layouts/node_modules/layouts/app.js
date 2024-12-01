const express = require('express'); 
const ejs = require('ejs');
const app = express(); 
const cookieParser = require('cookie-parser'); 
require('dotenv').config(); 
const expressLayouts = require('express-ejs-layouts'); 
const bodyParser = require('body-parser');
const session = require('express-session'); 
const flash = require('connect-flash'); 
const path = require('path'); 

// Configura o body-parser para parsear JSON e dados de formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura o middleware de sessão
app.use(session({
   secret: "Pampabooks", // Segredo usado para assinar a sessão
   resave: true, // Força a sessão a ser salva novamente no store, mesmo que não tenha sido modificada
   saveUninitialized: true // Força uma sessão "não inicializada" a ser salva no store
}));

app.use(flash()); // Configura o middleware connect-flash para mensagens flash
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public'

// Middleware para adicionar variáveis globais às respostas
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.session.usuario || null;
   if (req.session.usuario) {
      res.locals.userlogado = req.session.usuario.nome;
   } else {
      res.locals.userlogado = null;
   }
   next();
});

app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layout')
app.use(express.static('public'))
const rotasFrontend = require('./rotas/rotasFrontend')
app.use('/', rotasFrontend)

app.listen( process.env.PORTA, () => {
   console.log('Servidor rodando na porta', process.env.PORTA)
})