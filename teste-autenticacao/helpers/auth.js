const jwt = require('jsonwebtoken');
const segredoJWT = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Acesso negado. Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensagem: 'Token inválido' });
    }

    jwt.verify(token, segredoJWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensagem: 'Token inválido ou não autorizado.' });
        }
        req.usuario = decoded;
        next();
    });
};