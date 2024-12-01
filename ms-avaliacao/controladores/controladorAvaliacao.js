const Avaliacao = require('../modelos/avaliacao')
const axios = require('axios')

// Função para adicionar uma nova avaliação
exports.adicionarAvaliacao = async (req, res) => {
    const { livroId, usuarioId, avaliacao, comentario } = req.body; // Extrai os dados da avaliação do corpo da requisição
    console.log("teste", avaliacao);
    
    // Cria um novo objeto de avaliação com os dados fornecidos
    const novaAvaliacao = new Avaliacao({
        livroId,
        usuarioId,
        avaliacao,
        comentario
    });

    try {
        // Salva a nova avaliação no banco de dados
        await novaAvaliacao.save();
        res.status(201).send('Avaliação adicionada com sucesso'); // Retorna uma mensagem de sucesso com status 201
    } catch (erro) {
        res.status(500).send('Erro ao adicionar avaliação: ' + erro); // Em caso de erro, retorna uma mensagem de erro com status 500
    }
}

// Função para listar avaliações de um livro
exports.listarAvaliacoes = async (req, res) => {
    const { livroId } = req.params; // Obtém o ID do livro dos parâmetros da requisição
    console.log(livroId);
    try {
        // Procura avaliações no banco de dados pelo ID do livro
        const avaliacoes = await Avaliacao.find({ livroId: livroId });
        if (!avaliacoes || avaliacoes.length === 0) {
            // Se não houver avaliações, retorna null
            return res.json(null);
        }
        // Retorna as avaliações encontradas
        res.json(avaliacoes);
    } catch (error) {
        console.error('Erro ao listar avaliações:', error.message);
        // Em caso de erro, retorna uma mensagem de erro com status 500
        res.status(500).send('Erro ao listar avaliações: ' + error.message);
    }
};
