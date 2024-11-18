const jwt = require('jsonwebtoken');
const segredo = process.env.SECRET;
const verificarToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ mensagem: 'Token não fornecido.' });
    }
    
    jwt.verify(token,segredo, (erro, usuariodecodificado) => {
        if (erro) {
        return res.status(500).json({ mensagem: 'Falha ao verificar token' });
        }
        req.usuario = usuariodecodificado;
        next();
    });
    }

module.exports = verificarToken;
