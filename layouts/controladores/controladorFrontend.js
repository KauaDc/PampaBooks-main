const axios = require('axios');
const FormData = require('form-data');




//rota teste
//
/*
   cookie ou localstorage
   Usar ejs para enviar o token 
*/

//pagina login
exports.paginaLogin = (req, res) => {
   res.render('login', {
      error: null
   });
};

exports.processoLogin = async (req, res) => {
   const { email, senha } = req.body;
   console.log(email, senha);
   try {
   const resposta = await axios.post('http://localhost:3000/api/autenticacao/login',{ email, senha });
   console.log(resposta.data);
   res.json(resposta.data);
   } catch (erro) {
   res.status(401).json({ mensagem: 'Falha na autenticação. Verifique suas credenciais.' });
   }
   }
   


//pagina de cadastro
exports.paginaCadastro = (req, res) => {
   res.render('cadastro');
}


exports.processoCadastro = async (req, res) => {
   const {
      nome,
      email,
      senha
   } = req.body;

   if (!nome || !email || !senha) {
      return res.render('cadastro', {
         error: 'Todos os campos são obrigatórios.'
      });
   }

   try {
      const response = await axios.post('http://localhost:3001/api/autenticacao/registro', {
         nome,
         email,
         senha
      });

      if (response.status === 201) {
         return res.redirect('/login');
      }

   } catch (erro) {
      if (erro) {
         return res.render('cadastro', {
            error: "Erro ao cadastrar usuario"
         });
      }
   }
}


//rotas catalogo

exports.paginaCatalogo = async (req, res) => {
   try {
      const resposta = await axios.get('http://localhost:3002/api/catalogo/livros');

      res.render('index', {
         livros: resposta.data.livro,
         categorias: resposta.data.categoria
      });
   } catch (erro) {
      console.error('Erro ao buscar livros:');
   }
}

//rotas catalgo post


exports.cadastroLivro = async (req, res) => {
   try {
      const resposta = await axios.get('http://localhost:3002/api/catalogo/categorias');
      res.render('cadastroLivro', { categorias: resposta.data});
   } catch (erro) {
      console.error('Erro ao buscar categorias:', erro.message);
   }

}

exports.processoCadastroLivro = async (req, res) => {
   const { titulo, autor, descricao, categorias } = req.body;
   const capa = req.file;
   
   const formData = new FormData();
   formData.append('titulo', titulo);
   formData.append('autor', autor);
   formData.append('descricao', descricao);
   formData.append('categorias', categorias);

   if(capa){
      formData.append('capa', capa.buffer, capa.originalname);
   }

   try {
      const response = await axios.post('http://localhost:3002/api/catalogo/livros',formData,{
         headers:{
            ...formData.getHeaders
         }
      })

      res.redirect('/');
   } catch (erro) {
      if (erro) {

         return res.render('cadastroLivro', {
            error: "Erro ao adicionar livro"
         });

      }
   }
}

//rotas pedidos
exports.pedidos = async (req, res) => {
   res.render('pedidos');
}