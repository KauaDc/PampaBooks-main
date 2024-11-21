const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../modelos/Usuario');
const segredo = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser'); 


exports.login = async (req, res) => {

  const { email, senha } = req.body;
  console.log(req.body); // Log para depuração
  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: 'Senha inválida' });
    }
    const sessaoUsuario = { id: usuario._id , nome: usuario.nome , email:usuario.email}
    const token = jwt.sign({ id: usuario._id }, segredo, {expiresIn: '1h'});
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ mensagem: 'Login realizado com sucesso', token , sessaoUsuario})


} catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro });
  }
}





exports.registro = async (req, res) => {
  try {
    console.log(req.body); // Log para depuração
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
   }
   const novoUsuario = new User({ email, senha });
   await novoUsuario.save();
   res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
 } catch (erro) {
   res.status(400).json({ mensagem: 'Erro ao registrar usuário', erro });
 }


};

