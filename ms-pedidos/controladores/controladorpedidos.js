const { default: mongoose } = require('mongoose');
const Pedido = require('../modelos/pedido');
const axios = require('axios');
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
try {
// Verificar se existe um pedido pendente para o usuário
let pedido = await Pedido.findOne({ usuarioid: usuarioid, status: 'pendente' });

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
  const {usuarioid} = req.params;
 try {
let pedidos = await Pedido.find({ usuarioid: usuarioid });

if (!pedidos || pedidos.length === 0) {
return res.status(404).send('Nenhum pedido encontrado para este usuário');
}

const pedidosComDetalhes = await Promise.all(pedidos.map(async (pedido) => {
const itemsComDetalhes = await Promise.all(pedido.items.map(async (item) => {
try {
const respostaLivro = await axios.get(`http://localhost:3002/api/catalogo/livros/${item.livro}`);
return {
...item.toObject(),
livroDetalhes: respostaLivro.data
};
} catch (erro) {
console.error(`Erro ao buscar detalhes do livro ${item.livro}:`, erro.message);
return {
...item.toObject(),
livroDetalhes: null
};
}
}));

return {
...pedido.toObject(),
items: itemsComDetalhes
};
}));

// Retornar a resposta em JSON com os detalhes completos
res.json(pedidosComDetalhes);
} catch (error) {
console.error('Erro ao listar pedidos:', error.message);
res.status(500).send('Erro ao listar pedidos: ' + error.message);
}
}






exports.removerLivroPedidoPorQuantidade = async (req, res) => {
  const { pedidoId, livroId } = req.params;
    const { quantidade } = req.body;

    try {
        console.log('Removendo', quantidade, 'do item', livroId, 'do pedido', pedidoId);
        const pedido = await Pedido.findById(pedidoId);

        if (pedido) {
            let itemEncontrado = false;

            pedido.items = pedido.items.map(item => {
                if (item._id.toString() === livroId) {
                    itemEncontrado = true;

                    if (item.quantidade > quantidade) {
                        item.quantidade -= quantidade; // Reduz a quantidade
                    } else {
                        return null; // Marca para remoção se quantidade a ser removida for igual ou maior
                    }
                }
                return item;
            }).filter(item => item !== null); // Filtra itens null (removidos)

            if (!itemEncontrado) {
                return res.status(404).json({ message: 'Item não encontrado no pedido' });
            }

            pedido.total = calcularTotalPedido(pedido.items);
            await pedido.save();
            res.status(200).json({ message: 'Quantidade do item ajustada ou removido com sucesso' });
        } else {
            res.status(404).json({ message: 'Pedido não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao remover a quantidade do item do pedido:', err.message);
        res.status(500).json({ message: 'Erro ao remover a quantidade do item: ' + err.message });
    }
};


exports.finalizarPedido = async (req, res) => {
  const { pedidoId } = req.params;
  
  try {
  console.log('Finalizando o pedido', pedidoId);
  const pedido = await Pedido.findById(pedidoId);
  
  if (pedido) {
  pedido.status = 'concluido';
  await pedido.save();
  res.status(200).json({ message: 'Pedido concluído com sucesso' });
  } else {
  res.status(404).json({ message: 'Pedido não encontrado' });
  }
  } catch (err) {
  console.error('Erro ao finalizar o pedido:', err.message);
  res.status(500).json({ message: 'Erro ao finalizar o pedido: ' + err.message });
  }
  };
  