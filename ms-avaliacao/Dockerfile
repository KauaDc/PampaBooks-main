# Escolher uma imagem base
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta em que a aplicação vai rodar
EXPOSE 3006

# Comando para iniciar a aplicação
CMD ["npm", "start"]