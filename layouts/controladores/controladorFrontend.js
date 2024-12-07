const axios = require('axios');
const FormData = require('form-data'); 
const session = require('express-session');

// Função para renderizar a página de login
exports.paginaLogin = (req, res) => {
   res.render('login', {usuario: null}); // Renderiza a página de login e passa um objeto com o usuário como null
};

// Função para processar o login
exports.processoLogin = async (req, res) => {
   const { email, senha } = req.body; // Extrai o email e a senha do corpo da requisição
   try {
       // Faz uma requisição POST para a API de autenticação com o email e a senha
       const resposta = await axios.post('http://localhost:3000/api/autenticacao/login', { email, senha });
       console.log(resposta.data)
       req.session.usuario = resposta.data.sessaoUsuario; // Armazena os dados do usuário na sessão
       res.json(resposta.data); // Retorna a resposta da API como JSON
   } catch (erro) {
       // Em caso de erro, retorna uma mensagem de falha na autenticação com status 401
       res.status(401).json({ mensagem: 'Falha na autenticação. Verifique suas credenciais.' });
   }
}
   

// Função para realizar logout
exports.logout = async(req, res) => {
   try {
      // Faz uma requisição POST para a API de logout
      const resposta = await axios.post('http://localhost:3000/api/autenticacao/logout')
      // Destroi a sessão do usuário
         req.session.destroy();
         res.redirect('/login'); // Redireciona para a página inicial
   } catch (erro) {
      console.log(erro)
   }
}

// Função para renderizar a página de cadastro
exports.paginaCadastro = (req, res) => {
   res.render('cadastro', {usuario: null});
}

// Função para processar o cadastro
exports.processoCadastro = async (req, res) => {
   const { nome, email, senha } = req.body;

   // Verifica se todos os campos obrigatórios foram preenchidos
   if (!nome || !email || !senha) {
      return res.render('cadastro', {
         error: 'Todos os campos são obrigatórios.'
      });
   }

   try {
      // Faz uma requisição POST para a API de registro
      const response = await axios.post('http://localhost:3000/api/autenticacao/registro', {
         nome, email, senha
      });

      // Se o cadastro for bem-sucedido, redireciona para a página de login
      if (response.status === 201) {
         return res.redirect('/login');
      }

   } catch (erro) {
      // Em caso de erro, renderiza a página de cadastro com uma mensagem de erro
      return res.render('cadastro', {
         error: "Erro ao cadastrar usuario"
      });
   }
}

// Função para renderizar a página do catálogo
exports.paginaCatalogo = async (req, res) => {
   var usuarioId = req.session.usuario ? req.session.usuario.id : null;

   try {
      // Faz uma requisição GET para a API de catálogo
      const resposta = await axios.get('http://localhost:3002/api/catalogo/livros');
      // Renderiza a página do catálogo com os dados recebidos
      
console.log(req.session.usuario)
      res.render('index', {
         livros: resposta.data.livro,
         categorias: resposta.data.categoria,
         usuario: usuarioId
      });
   } catch (erro) {
      console.error('Erro ao buscar livros:');
   }
}

// Função para renderizar a página de detalhes de um livro
exports.paginaDetalhes = async (req, res) => {
   const { id } = req.params;
   var usuarioId = req.session.usuario ? req.session.usuario.id : null;

   try {
      // Faz uma requisição GET para a API de detalhes do livro
      const resposta = await axios.get(`http://localhost:3002/api/catalogo/livros/${id}`);
      // Renderiza a página de detalhes com os dados recebidos
      res.render('detalhes', { livro: resposta.data, usuario: usuarioId });
   } catch (erro) {
      console.error('Erro ao buscar livro:', erro.message);
   }
}

// Função para renderizar a página de cadastro de livros
exports.cadastroLivro = async (req, res) => {
   var usuarioId = req.session.usuario ? req.session.usuario.id : null;

   try {
      // Faz uma requisição GET para a API de categorias
      const resposta = await axios.get('http://localhost:3002/api/catalogo/categorias');
      // Renderiza a página de cadastro de livros com as categorias recebidas
      res.render('cadastroLivro', { categorias: resposta.data, usuario: usuarioId });
   } catch (erro) {
      console.error('Erro ao buscar categorias:', erro.message);
   }
}

// Função para processar o cadastro de livros
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
      // Faz uma requisição POST para a API de cadastro de livros
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
}

// Função para renderizar a página de pedidos do usuário
exports.pedidos = async (req, res) => {
   const usuarioid = req.session.usuario.id;
   try {
      // Faz uma requisição GET para a API de pedidos do usuário
      const resposta = await axios.get(`http://localhost:3005/api/pedidos/usuario/${usuarioid}/pedidos`);
      console.log(resposta.data)
      // Renderiza a página de pedidos com os dados recebidos
      res.render('pedidos', { pedidos: resposta.data, usuario: req.session.usuario });
   } catch (erro) {
      console.error('Erro ao buscar pedidos:', erro.message);
   }
}

// Função para processar a criação de um pedido
exports.processoPedidos = async (req, res) => {
   const usuarioid = req.session.usuario.id;
   const livro = { livroId: req.body.livroId, preco: req.body.preco };
   try {
      // Faz uma requisição POST para a API de criação de pedidos
      const resposta = await axios.post('http://localhost:3005/api/pedidos/criarpedido', { usuarioid, livro });
   } catch (erro) {
      console.error('Erro ao adicionar livro ao pedido:', erro.message);
      res.status(500).send('Erro ao adicionar livro ao pedido: ' + erro.message);
   }
}

// Função para processar a remoção de quantidade de um livro no pedido
exports.removerQuantidade = async (req, res) => {
   const { livroId, pedidoId, quantidade } = req.body;
   try {
      // Faz uma requisição POST para a API de remoção de quantidade
      const resposta = await axios.post(`http://localhost:3005/api/pedidos/removerquantidade/${pedidoId}/${livroId}`, { quantidade });
      res.redirect('/pedidos');
   } catch (erro) {
      console.error('Erro ao remover livro do pedido:', erro.message);
      res.status(500).send('Erro ao remover livro do pedido: ' + erro.message);
   }
}

// Função para processar a finalização de um pedido
exports.finalizarPedido = async (req, res) => {
   const { pedidoId } = req.body;
   try {
      // Faz uma requisição POST para a API de finalização de pedidos
      const resposta = await axios.post(`http://localhost:3005/api/pedidos/finalizarPedido/${pedidoId}`);
      res.redirect("/");
   } catch (erro) {
      console.error('Erro ao finalizar pedido:', erro.message);
      res.status(500).json({ message: 'Erro ao finalizar o pedido' });
   }
}

// Função para processar a avaliação de um livro
exports.processoAvaliacao = async (req, res) => {
   const { livroId, avaliacao, comentario } = req.body;
   const usuarioId = req.session.usuario.id;
   console.log(req.body)
   try {
      // Faz uma requisição POST para a API de avaliação
      const resposta = await axios.post('http://localhost:3006/api/avaliacao/novaavaliacao', { usuarioId, livroId, avaliacao, comentario });
    res.redirect(`/livros/${livroId}`);
   } catch (erro) {
      console.error('Erro ao avaliar livro:', erro.message);
      res.status(500).send('Erro ao avaliar livro: ' + erro.message);
   }
}

// Função para renderizar a página de edição de perfil
exports.paginaEditarPerfil = async (req, res) => {
   var usuarioId = req.session.usuario ? req.session.usuario.id : null;
   if (!usuarioId) {
      res.redirect('/login');
   }
   try {
      // Faz uma requisição GET para a API de edição de perfil
      const resposta = await axios.get(`http://localhost:3000/api/autenticacao/editarperfil/${usuarioId}`);
      res.render('editarPerfil', { usuario: resposta.data });
   } catch (erro) {
      console.error('Erro ao buscar perfil:', erro.message);
   }
}

// Função para processar a edição de perfil
exports.processoEditarPerfil = async (req, res) => {
   const { usuarioId, nome, email } = req.body;
   console.log(usuarioId)
   try {
      // Faz uma requisição PUT para a API de edição de perfil
      const resposta = await axios.put(`http://localhost:3000/api/autenticacao/editarperfil/${usuarioId}`, { nome, email });
      res.redirect('/');
   } catch (erro) {
      console.error('Erro ao editar perfil:', erro.message);
   }
}