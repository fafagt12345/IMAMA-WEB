# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Env vars akan diambil dari Railway Dashboard saat build
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Set default port ke 80 jika variabel PORT tidak ditemukan
ENV PORT=80

# Salin hasil build dari Vite (folder dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Salin config sebagai template agar Railway bisa menyuntikkan port secara dinamis
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]