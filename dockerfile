# Etapa 1: Build
FROM node:18-alpine AS builder

# Crear directorio de la app
WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar la app de Next.js
RUN npm run build

# Etapa 2: Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar solo lo necesario de la etapa anterior
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Puerto de Next.js
EXPOSE 3000

# Comando para arrancar Next.js en modo producción
CMD ["npm", "run", "start"]
