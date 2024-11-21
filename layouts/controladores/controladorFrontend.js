const axios = require('axios');
const FormData = require('form-data');
const session = require('express-session');




//pagina login
exports.paginaLogin = (req, res) => {
   res.render('login', {usuario: req.usuario});
};

exports.processoLogin = async (req, res) => {
   const { email, senha } = req.body;
   //console.log(email, senha);
   try {
    
   const resposta = await axios.post('http://localhost:3000/api/autenticacao/login',{ email, senha });
   req.session.usuario = resposta.data.sessaoUsuario
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
   //console.log("usuario:",req.session.usuario);
   console.log(req.session.usuario)
   try {
      const resposta = await axios.get('http://localhost:3002/api/catalogo/livros');
      res.render('index', {
         livros: resposta.data.livro,
         categorias: resposta.data.categoria,
         usuario: req.session.usuario
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
const { titulo, autor, descricao, categorias, preco } = req.body;
const capa = req.file;

const formData = new FormData();
formData.append('titulo', titulo);
formData.append('autor', autor);
formData.append('descricao', descricao);
formData.append('categorias', categorias);
formData.append('preco', preco);

if (capa) {
formData.append('capa', capa.buffer.toString('base64'));
}
console.log(formData)
try {
const response = await axios.post('http://localhost:3002/api/catalogo/livros', formData, {
headers: {
...formData.getHeaders()
}
});
console.log(response);
res.redirect('/');
} catch (erro) {
console.error('Erro ao adicionar livro:', erro.message);
res.render('cadastroLivro', {
error: "Erro ao adicionar livro"
});
}
};


//rotas pedidos
exports.pedidos = async (req, res) => {
   res.render('pedidos');
}

exports.processoPedidos = async (req, res) => {
   const usuarioid = req.session.usuario.id;
   const livro = { livroId: req.body.livroId, preco: req.body.preco};
   try {
       const resposta = await axios.post('http://localhost:3005/api/pedidos/criarpedido', { usuarioid, livro});
       res.json(resposta.data);
   } catch (erro) {
       console.error('Erro ao adicionar livro ao pedido:', erro.message);
       res.status(500).send('Erro ao adicionar livro ao pedido: ' + erro.message);
   }
}