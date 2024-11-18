const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const segredoJWT = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).send('Usuário não encontrado');
    }
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).send('Senha inválida');
    }
    const token = jwt.sign({ id: usuario._id }, segredoJWT, { expiresIn: '1h' });
    res.json({ token });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

exports.registro = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }
    const novoUsuario = new User({ email, senha });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (erro) {
    res.status(400).json({ mensagem: 'Erro ao registrar usuário' });
  }
};

exports.validaToken = (req, res) => {
  res.status(200).json({ mensagem: 'Token válido', usuario: req.usuario });
};