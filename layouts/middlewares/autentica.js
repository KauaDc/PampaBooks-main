const jwt = require('jsonwebtoken'); 
const segredo = process.env.SECRET; 

// Função middleware para verificar o token JWT
const verificarToken = (req, res, next) => {
    const token = req.cookies['token']; // Obtém o token JWT dos cookies
    console.log(req.cookies); // Loga os cookies no console para depuração

    if (!token) {
        // Se o token não for fornecido, retorna um erro 403 (Proibido)
        return res.status(403).json({ mensagem: 'Token não fornecido.' });
    }
    
    // Verifica o token JWT usando o segredo
    jwt.verify(token, segredo, (erro, usuariodecodificado) => {
        if (erro) {
            console.log(erro); // Loga o erro no console para depuração
            // Se houver um erro na verificação, retorna um erro 500 (Erro Interno do Servidor)
            return res.status(500).json({ mensagem: 'Falha ao verificar token' });
        }
        // Se o token for válido, armazena os dados do usuário decodificado na requisição
        req.usuario = usuariodecodificado;
        next(); // Chama o próximo middleware ou rota
    });
}

module.exports = verificarToken; // Exporta a função middleware para uso em outras partes da aplicação