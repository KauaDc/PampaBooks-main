const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
  usuarioid: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [{
    livro: {
    type: Schema.Types.ObjectId,
    ref: 'Livro',
    required: true
    },
    quantidade: {
    type: Number,
    required: true,
    default: 1
    },
    preco: {
    type: Number,
    required: true
    }
 }],
 total: {
  type: Number,
  required: false,
  default: 0
  },
    
  dataPedido: {
    type: Date,
    default: Date.now
  },

})

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;

