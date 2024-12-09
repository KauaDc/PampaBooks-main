const Livro = require('../modelos/Livros');
const Categoria = require('../modelos/Categorias');
const { GridFSBucket } = require('mongodb');
const axios = require('axios');

// Função para adicionar um novo livro
exports.adicionarLivro = async (req, res) => {
   const { capa, titulo, autor, descricao, categorias, preco } = req.body; // Extrai os dados do livro do corpo da requisição

   // Cria um novo objeto de livro com os dados fornecidos
   const novoLivro = new Livro({
     capa,
     titulo,
     autor,
     descricao,
     categorias,
     preco
   });

   try {
     // Salva o novo livro no banco de dados
     await novoLivro.save();
     console.log('Livro adicionado com sucesso');
     res.status(201).send('Livro adicionado com sucesso'); // Retorna uma mensagem de sucesso com status 201
   } catch (erro) {
     res.status(500).send('Erro ao adicionar livro: ' + erro.message); // Em caso de erro, retorna uma mensagem de erro com status 500
   }
};

// Função para adicionar uma nova categoria
exports.adiconarCategoria = async (req, res) => {
   const { nome } = req.body; // Extrai o nome da categoria do corpo da requisição

   // Cria um novo objeto de categoria com os dados fornecidos
   const novaCategoria = new Categoria({
      nome
   });

   try {
      // Salva a nova categoria no banco de dados
      await novaCategoria.save();
      res.status(201).send('Categoria adicionada com sucesso'); // Retorna uma mensagem de sucesso com status 201
   } catch (erro) {
      res.status(500).send('Erro ao adicionar categoria: ' + erro); // Em caso de erro, retorna uma mensagem de erro com status 500
   }
};

// Função para listar todos os livros e suas categorias
exports.listarLivros = async (req, res) => {
   try {
      // Agrega categorias e conta a quantidade de livros em cada uma
      const categoria = await Categoria.aggregate([
         {
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
                  $size: '$livros' // Adiciona um campo 'quantLivros' com o tamanho do array 'livros'
               }
            }
         }
      ]);

      // Busca todos os livros e popula o campo 'categorias'
      const livro = await Livro.find().populate('categorias');
      res.json({
         categoria,
         livro
      }); // Retorna as categorias e os livros como resposta JSON
      console.log('Livros listados com sucesso');
   } catch (erro) {
      res.status(500).send('Erro ao listar livros: ' + erro); // Em caso de erro, retorna uma mensagem de erro com status 500
   }
};

// Função para listar todas as categorias
exports.listarCategorias = async (req, res) => {
   try {
      // Busca todas as categorias no banco de dados
      const categorias = await Categoria.find();
      res.json(categorias); // Retorna as categorias como resposta JSON
      console.log('Categorias listadas com sucesso');
   } catch (erro) {
      res.status(500).send('Erro ao listar categorias: ' + erro); // Em caso de erro, retorna uma mensagem de erro com status 500
   }
};

// Função para listar os detalhes de um livro por ID, incluindo avaliações
exports.listarLivrosporId = async (req, res) => {
   const { livroId } = req.params; // Obtém o ID do livro dos parâmetros da requisição
   console.log('Buscando detalhes do livro', livroId);

   try {
       // Buscar os detalhes do livro no banco de dados e popula o campo 'categorias'
       const livro = await Livro.findById(livroId).populate('categorias');

       if (!livro) {
           return res.status(404).send('Livro não encontrado'); // Retorna 404 se o livro não for encontrado
       }

         // Buscar as avaliações do livro chamando a API externa
         const respostaAvaliacoes = await axios.get(`http://localhost:3006/api/avaliacao/${livroId}`);
         const avaliacoes = respostaAvaliacoes.data;

         // Verificar se há avaliações
         if (!avaliacoes || avaliacoes.length === 0) {
            return res.json({
                  livro: livro.toObject(), // Converte o documento Mongoose para objeto JavaScript
                  avaliacoes: [], // Retorna um array vazio se não houver avaliações
                  mensagem: 'Nenhuma avaliação encontrada para este livro' // Mensagem informativa
            });
         }

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
            avaliacoes: avaliacoesComUsuarios // Adiciona as avaliações com usuários, se existirem
         };

       // Enviar a resposta em formato JSON
       res.json(detalhesComAvaliacoes);
   } catch (error) {
       console.error('Erro ao buscar detalhes do livro ou avaliações:', error.message);
       res.status(500).send('Erro ao buscar detalhes do livro ou avaliações: ' + error.message); // Responde com erro 500 e mensagem detalhada
   }
};


// Função para listar os detalhes de um livro por ID
exports.listarLivrosPedidos = async (req, res) => {
   const { livroId } = req.params; // Obtém o ID do livro dos parâmetros da requisição

   console.log('Buscando pedidos para o livro', livroId);
   try {
      // Busca os detalhes do livro pelo ID e popula o campo 'categorias'
      const livro = await Livro.findById(livroId).populate('categorias');

      if (!livro) {
         return res.status(404).send('Livro não encontrado'); // Retorna 404 se o livro não for encontrado
      }
      res.json(livro); // Retorna os detalhes do livro como resposta JSON
   } catch (error) {
      console.error('Erro ao buscar detalhes do livro:', error.message);
      res.status(500).send('Erro ao buscar detalhes do livro: ' + error.message); // Em caso de erro, retorna uma mensagem de erro com status 500
   }
};
