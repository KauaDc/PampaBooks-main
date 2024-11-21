const axios = require('axios');

// Função para buscar dados do usuário
const buscarUsuario = async (id) => {
  try {
    const response = await axios.get('http://localhost:3000/api/autenticacao/procurausuario', { params: { id } });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    throw error;
  }
};

// Função para buscar dados do catálogo de livros
const buscarCatalogo = async () => {
  try {
    const response = await axios.get('http://localhost:3002/api/catalogo/livros');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar catálogo de livros:', error.message);
    throw error;
  }
};

// Rota principal para renderizar index
const renderizarIndex = async (req, res) => {
  try {
    let usuarioDados = null;
    if (req.session.usuario) {
      // Buscar dados do usuário logado
      usuarioDados = await buscarUsuario(req.session.usuario.id);
    }

    // Buscar dados do catálogo de livros
    const catalogo = await buscarCatalogo();

    // Renderizar a página com os dados apropriados
    res.render('index', {
      livros: catalogo.livro,
      categorias: catalogo.categoria,
      usuario: usuarioDados
    });
  } catch (error) {
    console.error('Erro ao renderizar index:', error.message);
    res.status(500).send('Erro ao carregar a página inicial. Tente novamente mais tarde.');
  }
};

module.exports = { renderizarIndex };