# ----------- BUILD STAGE -----------
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# ----------- NGINX STAGE -----------
FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html

# Replace default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
