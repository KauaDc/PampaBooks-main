
const Livro = require('../modelos/Livros');
const Categoria = require('../modelos/Categorias');
const {GridFSBucket} = require('mongodb');
const axios = require('axios');
exports.adicionarLivro = async (req, res) => {
   const {capa, titulo, autor, descricao, categorias, preco } = req.body;
 
 
   const novoLivro = new Livro({
     capa,
     titulo,
     autor,
     descricao,
     categorias,
     preco
   });
 
   try {
     await novoLivro.save();
     console.log('Livro adicionado com sucesso');
     res.status(201).send('Livro adicionado com sucesso');
   } catch (erro) {
     res.status(500).send('Erro ao adicionar livro: ' + erro.message);
   }
 };
 

exports.adiconarCategoria = async (req, res) => {
   const {
      nome
   } = req.body
   const novaCategoria = new Categoria({
      nome
   })
   try {
      await novaCategoria.save()
      res.status(201).send('Categoria adicionada com sucesso')
   } catch (erro) {
      res.status(500).send('Erro ao adicionar categoria: ' + erro)
   }
}

//////rotas GET
exports.listarLivros = async (req, res) => {
   try {
      const categoria = await Categoria.aggregate([{
            $lookup: {
               from: 'livros',
               localField: '_id',
               foreignField: 'categorias',
               as: 'livros'
            }
         },
         {
            $match: {
               'livros.0': {
                  $exists: true
               }
            }
         },
         {
            $addFields: {
               'quantLivros': {
                  $size: '$livros'
               }
            }
         }
      ]);

      const livro = await Livro.find().populate('categorias');
      res.json({
         categoria,
         livro
      })
      console.log('Livros listados com sucesso')
   } catch (erro) {
      res.status(500).send('Erro ao listar livros: ' + erro)
   }
}

exports.listarCategorias = async (req, res) => {
   try {
      const categorias = await Categoria.find()
      res.json(categorias)
      console.log('Categorias listadas com sucesso')
   } catch (erro) {
      res.status(500).send('Erro ao listar categorias: ' + erro)
   }
}


exports.listarLivrosporId = async (req, res) => {
const { livroId } = req.params;

try {
// Buscar os detalhes do livro no banco de dados e popula o campo 'categorias'
const livro = await Livro.findById(livroId).populate('categorias');

if (!livro) {
return res.status(404).send('Livro não encontrado'); // Retorna 404 se o livro não for encontrado
}

// Buscar as avaliações do livro chamando a API externa
const respostaAvaliacoes = await axios.get(`http://localhost:3006/api/avaliacao/${livroId}`);
const avaliacoes = respostaAvaliacoes.data;

// Obter informações dos usuários para cada avaliação chamando outra API externa
const avaliacoesComUsuarios = await Promise.all(avaliacoes.map(async avaliacao => {
try {
const respostaUsuario = await axios.get(`http://localhost:3000/api/autenticacao/procurarusuarios/${avaliacao.usuarioId}`);
const usuarioDetalhes = respostaUsuario.data;

return {
...avaliacao,
usuario: usuarioDetalhes
};
} catch (userError) {
console.error(`Erro ao buscar dados do usuário ${avaliacao.usuarioId}:`, userError.message);
return avaliacao; // Retorna a avaliação sem detalhes do usuário se houver erro
}
}));

const detalhesComAvaliacoes = {
livro: livro.toObject(), // Converte o documento Mongoose para objeto JavaScript
avaliacoes: avaliacoesComUsuarios || [] // Garante que não retorne valor indefinido
};

// Enviar a resposta em formato JSON
res.json(detalhesComAvaliacoes);
} catch (error) {
console.error('Erro ao buscar detalhes do livro ou avaliações:', error.message);
res.status(500).send('Erro ao buscar detalhes do livro ou avaliações: ' + error.message); // Responde com erro 500 e mensagem detalhada
}
};

exports.listarLivrosPedidos = async (req, res) => {
   const { livroId } = req.params;
 
   console.log('Buscando pedidos para o livro', livroId);
try {
const livro = await Livro.findById(livroId).populate('categorias');

if (!livro) {
return res.status(404).send('Livro não encontrado');
}
res.json(livro);
} catch (error) {
console.error('Erro ao buscar detalhes do livro:', error.message);
res.status(500).send('Erro ao buscar detalhes do livro: ' + error.message);
}
}
