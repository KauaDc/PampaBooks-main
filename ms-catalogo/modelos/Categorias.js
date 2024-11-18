const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriasSchema = new Schema({
    nome: {type: String, required: true},
    livros: [{type: Schema.Types.ObjectId, ref: 'Livro'}]
})

module.exports = mongoose.model('Categoria', categoriasSchema);