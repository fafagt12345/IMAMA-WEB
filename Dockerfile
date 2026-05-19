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
# Salin hasil build dari Vite (folder dist)
COPY --from=build /app/dist /usr/share/nginx/html
# Salin config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]