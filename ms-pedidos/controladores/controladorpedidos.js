const Pedido = require('../modelos/pedido');
// Função para calcular o total do pedido
const calcularTotalPedido = (items) => {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
  const preco = Number(items[i].preco);
  const quantidade = Number(items[i].quantidade);
  console.log('Preço:', preco, 'Quantidade:', quantidade);
  if (isNaN(preco) || isNaN(quantidade)) {
  throw new Error('Dados de item inválidos encontrados');
  }
  
  total += preco * quantidade;
  }
  
  return total
};

exports.criarPedido = async (req, res) => {
  const { usuarioid, livro } = req.body;
console.log('Usuário:', usuarioid, 'Livro:', livro);
try {
// Verificar se existe um pedido pendente para o usuário
let pedido = await Pedido.findOne({ usuarioid: usuarioid });

if (!pedido) {
// Se não existe, criar um novo pedido
const novoPedido = new Pedido({
usuarioid: usuarioid,
items: [{ livro: livro.livroId, quantidade: 1, preco: livro.preco }]
});



novoPedido.total = calcularTotalPedido(novoPedido.items);

await novoPedido.save();
console.log('Novo pedido criado com sucesso:', novoPedido);
return res.status(201).send('Pedido criado com sucesso e livro adicionado');
}

// Adiciona ou atualiza o livro no pedido existente
const itemExistente = pedido.items.find(item => item.livro.toString() === livro.livroId);
if (itemExistente) {
// Se o livro já está no pedido, incrementa a quantidade
itemExistente.quantidade += 1;
} else {
// Se o livro não está no pedido, adiciona como novo item
pedido.items.push({ livro: livro.livroId, quantidade: 1, preco: livro.preco });
}

// Recalcula o total do pedido usando a função calcularTotalPedido
pedido.total = calcularTotalPedido(pedido.items);

await pedido.save();
console.log('Pedido atualizado com sucesso:', pedido);
res.status(200).send('Livro adicionado ao pedido pendente com sucesso');
} catch (error) {
console.error('Erro ao adicionar livro ao pedido:', error.message);
res.status(500).send('Erro ao adicionar livro ao pedido: ' + error.message);
}
};

exports.listarPedidos = async (req, res) => {


};

exports.obterPedidoPorId = async (req, res) => {
  // Implementar lógica para obter detalhes de um pedido específico...
};

exports.obterPedidosPorUsuario = async (req, res) => {
  // Implementar lógica para listar todos os pedidos de um usuário...
};

exports.cancelarPedido = async (req, res) => {
  // Implementar lógica para cancelar um pedido...
};