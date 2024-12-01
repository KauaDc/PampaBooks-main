const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config(); // Carrega variáveis de ambiente a partir de um arquivo .env

const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // URL de conexão com o MongoDB
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => { // Gera 16 bytes aleatórios para o nome do arquivo
        if (err) {
          return reject(err); // Rejeita a promessa em caso de erro
        }
        const capa = buf.toString('hex') + path.extname(file.originalname); // Cria um nome de arquivo único
        const fileInfo = {
          filename: capa, // Define o nome do arquivo
          bucketName: 'uploads' // Define o bucket onde o arquivo será armazenado
        };
        resolve(fileInfo); // Resolve a promessa com as informações do arquivo
      });
    });
  }
});

const upload = multer({ storage });

module.exports = upload;