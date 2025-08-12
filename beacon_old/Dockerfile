FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY beacon_old/web/package*.json ./
COPY beacon_old/web/vite.config.js ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY beacon_old/web/src ./src
COPY beacon_old/web/index.html ./

# Expor porta
EXPOSE 3799

# Comando para desenvolvimento
CMD ["npm", "run", "dev"] 