const express = require('express')
const ejs = require('ejs')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash');
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
   secret: "Pampabooks",
   resave: true,
   saveUninitialized: true
})) 

app.use(flash());

app.use((req, res, next) => {
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