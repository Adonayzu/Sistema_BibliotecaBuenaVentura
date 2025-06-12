# Usa una imagen base de Node.js para construir el frontend
FROM node:18 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios al contenedor e instala dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto de los archivos y construye la aplicación
COPY . .
RUN npm run build

# Usa una imagen base de Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]