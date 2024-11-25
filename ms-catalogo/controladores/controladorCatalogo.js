const Livro = require('../modelos/Livros');
const Categoria = require('../modelos/Categorias');
const {GridFSBucket} = require('mongodb');

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