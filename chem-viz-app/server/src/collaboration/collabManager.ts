import type { Namespace, Socket } from 'socket.io';
import type { CollabUser } from '../types.js';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F0B27A', '#82E0AA',
];

export class CollabManager {
  // documentId -> Map<socketId, CollabUser>
  private sessions = new Map<string, Map<string, CollabUser>>();
  private colorIndex = 0;

  private getNextColor(): string {
    const color = COLORS[this.colorIndex % COLORS.length];
    this.colorIndex++;
    return color;
  }

  private getOrCreateSession(documentId: string): Map<string, CollabUser> {
    let session = this.sessions.get(documentId);
    if (!session) {
      session = new Map();
      this.sessions.set(documentId, session);
    }
    return session;
  }

  setup(namespace: Namespace): void {
    namespace.on('connection', (socket: Socket) => {
      console.log(`[Collab] Socket connected: ${socket.id}`);

      socket.on('join-document', (data: { documentId: string; userName: string }) => {
        const { documentId, userName } = data;
        const session = this.getOrCreateSession(documentId);

        const user: CollabUser = {
          id: socket.id,
          name: userName,
          color: this.getNextColor(),
        };

        session.set(socket.id, user);
        void socket.join(documentId);

        // Notify the joining user of existing users
        socket.emit('document-users', Array.from(session.values()));

        // Notify other users in the document
        socket.to(documentId).emit('user-joined', user);

        console.log(`[Collab] ${userName} joined document ${documentId}`);
      });

      socket.on('leave-document', (data: { documentId: string }) => {
        this.removeUserFromDocument(socket, data.documentId, namespace);
      });

      socket.on('cursor-move', (data: { documentId: string; cursor: { x: number; y: number } }) => {
        const session = this.sessions.get(data.documentId);
        const user = session?.get(socket.id);
        if (user) {
          user.cursor = data.cursor;
          socket.to(data.documentId).emit('cursor-moved', {
            userId: socket.id,
            cursor: data.cursor,
          });
        }
      });

      socket.on('formula-add', (data: { documentId: string; formula: unknown }) => {
        socket.to(data.documentId).emit('formula-added', {
          userId: socket.id,
          formula: data.formula,
        });
      });

      socket.on('formula-update', (data: { documentId: string; formula: unknown }) => {
        socket.to(data.documentId).emit('formula-updated', {
          userId: socket.id,
          formula: data.formula,
        });
      });

      socket.on('formula-delete', (data: { documentId: string; formulaId: string }) => {
        socket.to(data.documentId).emit('formula-deleted', {
          userId: socket.id,
          formulaId: data.formulaId,
        });
      });

      socket.on('disconnect', () => {
        // Remove user from all document sessions
        for (const documentId of this.sessions.keys()) {
          this.removeUserFromDocument(socket, documentId, namespace);
        }
        console.log(`[Collab] Socket disconnected: ${socket.id}`);
      });
    });
  }

  private removeUserFromDocument(socket: Socket, documentId: string, namespace: Namespace): void {
    const session = this.sessions.get(documentId);
    if (!session) return;

    const user = session.get(socket.id);
    if (!user) return;

    session.delete(socket.id);
    void socket.leave(documentId);

    namespace.to(documentId).emit('user-left', { userId: socket.id, userName: user.name });

    // Clean up empty sessions
    if (session.size === 0) {
      this.sessions.delete(documentId);
    }

    console.log(`[Collab] ${user.name} left document ${documentId}`);
  }
}
