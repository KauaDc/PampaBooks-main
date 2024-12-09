const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LivrosSchema = new Schema({
    capa: {type: String},
    titulo: {type: String, required: true},
    autor: {type: String, required: true},
    descricao: {type: String, required: true},
    categorias: {type: Schema.Types.ObjectId, ref:"Categoria",  required: false},
    preco: {type: Number, required: true},
})

module.exports = mongoose.model('Livro', LivrosSchema);