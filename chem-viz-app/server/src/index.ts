import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import documentRoutes from './routes/documents.js';
import chemistryRoutes from './routes/chemistry.js';
import { CollabManager } from './collaboration/collabManager.js';
import { setupYjsServer } from './collaboration/yjsServer.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const YJS_PORT = parseInt(process.env.YJS_PORT ?? '3002', 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// REST API routes
app.use('/api/documents', documentRoutes);
app.use('/api/chemistry', chemistryRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO for real-time collaboration
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

const collabNamespace = io.of('/collab');
const collabManager = new CollabManager();
collabManager.setup(collabNamespace);

// Yjs CRDT WebSocket server on separate port
setupYjsServer(YJS_PORT);

// Start HTTP + Socket.IO server
server.listen(PORT, () => {
  console.log(`[Server] Express + Socket.IO server listening on port ${PORT}`);
  console.log(`[Server] CORS origin: ${CLIENT_ORIGIN}`);
  console.log(`[Server] Yjs WebSocket server on port ${YJS_PORT}`);
});

export { app, server, io };
