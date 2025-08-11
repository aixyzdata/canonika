# Stage 1: Build estático com Vite
FROM node:20-alpine AS build

# Vamos trabalhar no diretório do template dentro do repo
WORKDIR /app/template/web

# Instala dependências
COPY template/web/package*.json ./
RUN npm ci || npm install

# Copia o código do template e a pasta shared do repo para resolver imports relativos
COPY template/web ./
COPY shared /app/shared

# Build de produção (Vite processará o SCSS automaticamente)
RUN npm run build

# Stage 2: Nginx para servir os assets
FROM nginx:1.25-alpine

# Copia os arquivos estáticos gerados para o root do Nginx
COPY --from=build /app/template/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

