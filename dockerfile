# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Instalar herramientas de compilación (por si alguna dependencia lo requiere)
RUN apk add --no-cache python3 make g++

# Copiar el resto del código
COPY . .

# Compilar Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar lo necesario desde la etapa builder
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
