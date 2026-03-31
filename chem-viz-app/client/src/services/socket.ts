import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { CollabUser, FormulaEntry } from '../types';

const SOCKET_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/collab`;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) s.connect();
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Actions
export function joinDocument(documentId: string, userName: string): void {
  getSocket().emit('join-document', { documentId, userName });
}

export function leaveDocument(documentId: string): void {
  getSocket().emit('leave-document', { documentId });
}

export function moveCursor(documentId: string, cursor: { x: number; y: number }): void {
  getSocket().emit('cursor-move', { documentId, cursor });
}

export function addFormula(documentId: string, formula: FormulaEntry): void {
  getSocket().emit('formula-add', { documentId, formula });
}

export function updateFormula(documentId: string, formula: FormulaEntry): void {
  getSocket().emit('formula-update', { documentId, formula });
}

export function deleteFormula(documentId: string, formulaId: string): void {
  getSocket().emit('formula-delete', { documentId, formulaId });
}

// Event listeners
type Cleanup = () => void;

export function onUserJoined(cb: (user: CollabUser) => void): Cleanup {
  const s = getSocket();
  s.on('user-joined', cb);
  return () => s.off('user-joined', cb);
}

export function onUserLeft(cb: (userId: string) => void): Cleanup {
  const s = getSocket();
  s.on('user-left', cb);
  return () => s.off('user-left', cb);
}

export function onCursorMoved(cb: (data: { userId: string; cursor: { x: number; y: number } }) => void): Cleanup {
  const s = getSocket();
  s.on('cursor-moved', cb);
  return () => s.off('cursor-moved', cb);
}

export function onFormulaAdded(cb: (formula: FormulaEntry) => void): Cleanup {
  const s = getSocket();
  s.on('formula-added', cb);
  return () => s.off('formula-added', cb);
}

export function onFormulaUpdated(cb: (formula: FormulaEntry) => void): Cleanup {
  const s = getSocket();
  s.on('formula-updated', cb);
  return () => s.off('formula-updated', cb);
}

export function onFormulaDeleted(cb: (formulaId: string) => void): Cleanup {
  const s = getSocket();
  s.on('formula-deleted', cb);
  return () => s.off('formula-deleted', cb);
}
