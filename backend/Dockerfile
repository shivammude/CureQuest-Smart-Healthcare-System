# ----------- BUILD STAGE -----------
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .

# ----------- PRODUCTION STAGE -----------
FROM node:18

WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
