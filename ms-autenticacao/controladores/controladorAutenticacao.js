const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../modelos/Usuario');
const segredo = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser');

// Função para processar o login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    // Procura o usuário pelo email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    // Compara a senha fornecida com a senha armazenada no banco de dados
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: 'Senha inválida' });
    }
    // Cria um objeto de sessão do usuário
    const sessaoUsuario = { id: usuario._id, nome: usuario.nome, email: usuario.email };
    // Gera um token JWT
    const token = jwt.sign({ id: usuario._id }, segredo, { expiresIn: '1h' });
    // Define o token como um cookie HTTP-only
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ mensagem: 'Login realizado com sucesso', token, sessaoUsuario });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro });
  }
}

// Função para processar o registro de um novo usuário
exports.registro = async (req, res) => {
  try {
    const { email, senha, nome } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }
    // Gera um hash para a senha
    const saltRounds = 10;
    const senhaHashed = await bcrypt.hash(senha, saltRounds);
    // Cria um novo usuário com a senha hash
    const novoUsuario = new User({ email, senha: senhaHashed, nome });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (erro) {
    console.error('Erro ao registrar usuário:', erro.message);
    res.status(400).json({ mensagem: 'Erro ao registrar usuário', erro });
  }
}

// Função para processar o logout
exports.logout = async (req, res) => {
  res.clearCookie('token'); // Limpa o cookie do token
  res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
}

// Função para procurar um usuário pelo ID
exports.procurarUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error.message);
    res.status(500).send('Erro ao buscar detalhes do usuário: ' + error.message);
  }
}

// Função para renderizar a página de edição de perfil
exports.editarPerfil = async (req, res) => {
  const { usuarioid } = req.params;
  console.log(req.params);
  console.log(usuarioid);
  try {
    const usuario = await User.findById(usuarioid);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error.message);
    res.status(500).send('Erro ao buscar detalhes do usuário: ' + error.message);
  }
}

// Função para processar a edição de perfil
exports.processoEditarPerfil = async (req, res) => {
  const { usuarioid } = req.params;
  const data = req.body;
  try {
    // Atualiza os dados do usuário no banco de dados
    const usuarioAtualizado = await User.findByIdAndUpdate(usuarioid, data, { new: true });
    if (!usuarioAtualizado) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(usuarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error.message);
    res.status(500).send('Erro ao atualizar dados do usuário: ' + error.message);
  }
}