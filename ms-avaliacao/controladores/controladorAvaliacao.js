const Avaliacao = require('../modelos/avaliacao')
const axios = require('axios')
exports.adicionarAvaliacao = async (req, res) => {
    const { livroId, usuarioId, avaliacao, comentario } = req.body
    console.log("teste", avaliacao)
    const novaAvaliacao = new Avaliacao({
        livroId,
        usuarioId,
        avaliacao,
        comentario
    })

    try {
        await novaAvaliacao.save()
        res.status(201).send('Avaliação adicionada com sucesso')
    } catch (erro) {
        res.status(500).send('Erro ao adicionar avaliação: ' + erro)
    }
}

exports.listarAvaliacoes = async (req, res) => {
    const { livroId } = req.params;
    console.log(livroId);
    try {
    // Buscar avaliações pelo livroId
    const avaliacoes = await Avaliacao.find({ livroId: livroId });
    if (!avaliacoes || avaliacoes.length === 0) {
    return res.json(null);
    }
    
    // Obter detalhes do livro para cada avaliação
    const detalhesAvaliacao = await Promise.all(avaliacoes.map(async (avaliacao) => {
    try {
    const respostaLivro = await axios.get(`http://localhost:3002/api/catalogo/livros/${livroId}`);
    return {
    ...avaliacao.toObject(),
    livroDetalhes: respostaLivro.data
    };
    } catch (erro) {
    console.error(`Erro ao buscar detalhes do livro ${avaliacao.livro}:`, erro.message);
    return {
    ...avaliacao.toObject(),
    livroDetalhes: null
    };
    }
    }));
    
    // Retornar a resposta em JSON com os detalhes completos
    res.json(detalhesAvaliacao);
    } catch (error) {
    console.error('Erro ao listar avaliações:', error.message);
    res.status(500).send('Erro ao listar avaliações: ' + error.message);
    }
    };
