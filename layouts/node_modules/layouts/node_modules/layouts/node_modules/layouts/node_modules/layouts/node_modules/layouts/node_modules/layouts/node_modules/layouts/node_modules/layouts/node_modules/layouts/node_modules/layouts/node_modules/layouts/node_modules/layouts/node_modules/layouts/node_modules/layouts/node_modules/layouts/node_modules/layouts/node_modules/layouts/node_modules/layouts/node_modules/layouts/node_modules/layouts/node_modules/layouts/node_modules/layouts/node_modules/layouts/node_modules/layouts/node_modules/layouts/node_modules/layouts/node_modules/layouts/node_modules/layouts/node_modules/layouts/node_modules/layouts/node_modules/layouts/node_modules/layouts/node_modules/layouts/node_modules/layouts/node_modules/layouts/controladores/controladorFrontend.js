const axios = require('axios');
const FormData = require('form-data');
const session = require('express-session');
const Pedido = require('../../ms-pedidos/modelos/pedido');
const avaliacao = require('../../ms-avaliacao/modelos/avaliacao');




//pagina login
exports.paginaLogin = (req, res) => {
   res.render('login', {usuario: null});
};

exports.processoLogin = async (req, res) => {
   const { email, senha } = req.body;
   try {
    
   const resposta = await axios.post('http://localhost:3000/api/autenticacao/login',{ email, senha });
   req.session.usuario = resposta.data.sessaoUsuario
   res.json(resposta.data);
   } catch (erro) {
   res.status(401).json({ mensagem: 'Falha na autenticação. Verifique suas credenciais.' });
   }
   }
   
//logout
exports.logout = async(req, res) => {
   try {
      const resposta = await axios.post('http://localhost:3000/api/autenticacao/logout')
      req.session.destroy((err) => {
         if (err) {
         console.error('Erro ao destruir a sessão:', err);
         res.status(500).send('Erro ao fazer logout.');
         } 
         res.redirect('/'); // Altere para a rota desejada após o logout
         });
   }catch(erro){
      console.log(erro)
   }
}

//pagina de cadastro
exports.paginaCadastro = (req, res) => {
   res.render('cadastro', {usuario: null});
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
      const response = await axios.post('http://localhost:3000/api/autenticacao/registro', {
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
   const usuarioid = req.session.usuario.id
   try{
      const resposta =  await axios.get(`http://localhost:3005/api/pedidos/usuario/${usuarioid}/pedidos`);
      res.render('pedidos', {pedidos: resposta.data});

   }
   catch(erro){
      console.error('Erro ao buscar pedidos:', erro.message);
   }
}

exports.processoPedidos = async (req, res) => {
   const usuarioid = req.session.usuario.id
   const livro = { livroId: req.body.livroId, preco: req.body.preco};
   try {
       const resposta = await axios.post('http://localhost:3005/api/pedidos/criarpedido', { usuarioid, livro});
         res.redirect('/');
      } catch (erro) {
       console.error('Erro ao adicionar livro ao pedido:', erro.message);
       res.status(500).send('Erro ao adicionar livro ao pedido: ' + erro.message);
   }
}


exports.removerQuantidade = async (req, res) => {
   const {livroId,pedidoId,quantidade} = req.body
   try {
      const resposta = await axios.post(`http://localhost:3005/api/pedidos/removerquantidade/${pedidoId}/${livroId}`,{quantidade});
      res.redirect('/pedidos')
  } catch (erro) {
      console.error('Erro ao remover livro do pedido:', erro.message);
      res.status(500).send('Erro ao remover livro do pedido: ' + erro.message);
  }

}
exports.finalizarPedido = async (req, res) => {
   const { pedidoId } = req.body; // Corrigir para extrair pedidoId do corpo da requisição
   try {
   const resposta = await axios.post(`http://localhost:3005/api/pedidos/finalizarPedido/${pedidoId}`);
   res.redirect("/");
   } catch (erro) {
   console.error('Erro ao finalizar pedido:', erro.message);
   res.status(500).json({ message: 'Erro ao finalizar o pedido' }); // Adicionar tratamento de erro adequado
   }
   };

//rotas avaliacao
exports.paginaAvaliacao = async (req, res) => {
   var usuarioId
   if (req.session.usuario) {
       usuarioId = req.session.usuario.id;
   }else{
       usuarioId = null;
   }
  const {livroId} = req.query
   console.log(livroId)
   try{
      const resposta = await axios.get(`http://localhost:3006/api/avaliacao/${livroId}`);
      console.log(resposta.data)
      console.log(resposta.data)
      if(resposta.data == null){
         res.render('avaliacao', {usuario:usuarioId,livroId:livroId, avaliacao: null});
      }
      res.render('avaliacao', {usuario:usuarioId,livroId:livroId, avaliacao: resposta.data});
}
catch(erro){  
   console.error('Erro ao buscar avaliações:', erro.message);
}
}




exports.processoAvaliacao = async (req, res) => {
   const { livroId, avaliacao, comentario } = req.body;
   const usuarioId = req.session.usuario.id;
   console.log(req.body)
   try {
     const resposta = await axios.post('http://localhost:3006/api/avaliacao/novaavaliacao', { usuarioId, livroId, avaliacao, comentario });
     res.redirect('/');
   } catch (erro) {
     console.error('Erro ao avaliar livro:', erro.message);
     res.status(500).send('Erro ao avaliar livro: ' + erro.message);
   }
 };
