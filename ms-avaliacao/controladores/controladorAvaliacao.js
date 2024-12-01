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
console.log('ID do Livro:', livroId); // Loga o ID do livro para verificação

try {
// Busca as avaliações no banco de dados
const avaliacoes = await Avaliacao.find({ livroId: livroId });

// Verifica se existe avaliação
if (!avaliacoes || avaliacoes.length === 0) {
return res.json(null); // Retorna null se não houver avaliações
}

// Retorna as avaliações em formato JSON
res.json(avaliacoes);
} catch (error) {
console.error('Erro ao listar avaliações:', error.message); // Loga o erro detalhado
res.status(500).send('Erro ao listar avaliações: ' + error.message); // Retorna uma resposta de erro 500 detalhada
}
};