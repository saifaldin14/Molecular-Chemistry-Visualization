# Stage 1: Build server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 2: Build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
ARG VITE_API_URL
ARG VITE_YJS_WS_URL
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

# Copy server build
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy client build
COPY --from=client-build /app/client/dist /app/client/dist

# Install a simple static file server for the client
RUN npm install -g serve@14

WORKDIR /app

# Copy startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV PORT=3001
ENV YJS_PORT=3002
ENV CLIENT_ORIGIN=http://localhost:5173

EXPOSE 3001 3002 5173

ENTRYPOINT ["./docker-entrypoint.sh"]
