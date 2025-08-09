# Stage 1: Build estático com Vite (usa contexto do repo para resolver shared)
FROM node:20-alpine AS build
WORKDIR /app/template/web
COPY template/web/package*.json ./
RUN npm ci || npm install
COPY template/web ./
# Copia os componentes/estilos compartilhados para dentro da imagem
COPY shared /app/shared
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/template/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

