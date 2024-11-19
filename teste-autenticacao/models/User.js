const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
email: {
type: String,
required: true,
unique: true,
},
senha: {
type: String,
required: true,
},
});

UserSchema.pre('save', async function(next) {
if (!this.isModified('senha')) {
return next();
}
const salt = await bcrypt.genSalt(10);
this.senha = await bcrypt.hash(this.senha, salt);
next();
});

UserSchema.methods.validarSenha = async function(senha) {
return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', UserSchema);