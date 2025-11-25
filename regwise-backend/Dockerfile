FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies, build TypeScript
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --production

ENV PORT=5000
EXPOSE 5000
CMD ["node", "dist/index.js"]
