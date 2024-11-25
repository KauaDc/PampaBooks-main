const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AvaliacaoSchema = new Schema({
    livroId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Livro',
      },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
      },
      avaliacao: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comentario: {
        type:String,
        required: false
    },
      data: {
        type: Date,
        default: Date.now,
      },
    });
    module.exports = mongoose.model('Avaliacao', AvaliacaoSchema);
    