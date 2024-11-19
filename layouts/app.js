const express = require('express')
const ejs = require('ejs')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layout')
app.use(express.static('public'))
const rotasFrontend = require('./rotas/rotasFrontend')
app.use('/', rotasFrontend)


app.listen(3004, () => {
   console.log('Servidor rodando na porta 3004')
})