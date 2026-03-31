import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { FormulaEntry, CollabUser } from '../types';

const YJS_WS_URL = import.meta.env.VITE_YJS_WS_URL || 'ws://localhost:3002';

interface UseCollaborationReturn {
  formulas: FormulaEntry[];
  addFormula: (entry: FormulaEntry) => void;
  removeFormula: (id: string) => void;
  updateFormula: (entry: FormulaEntry) => void;
  awarenessUsers: CollabUser[];
  connected: boolean;
}

export function useCollaboration(
  documentId: string | undefined,
  userName: string,
  userColor: string,
): UseCollaborationReturn {
  const [formulas, setFormulas] = useState<FormulaEntry[]>([]);
  const [awarenessUsers, setAwarenessUsers] = useState<CollabUser[]>([]);
  const [connected, setConnected] = useState(false);

  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const ydoc = new Y.Doc();
    docRef.current = ydoc;

    const provider = new WebsocketProvider(YJS_WS_URL, `doc-${documentId}`, ydoc);
    providerRef.current = provider;

    const yFormulas = ydoc.getArray<FormulaEntry>('formulas');

    // Sync formulas from Yjs array to local state
    const syncFormulas = () => {
      setFormulas(yFormulas.toArray());
    };

    yFormulas.observe(syncFormulas);
    syncFormulas();

    // Connection status
    provider.on('status', (event: { status: string }) => {
      setConnected(event.status === 'connected');
    });

    // Awareness (user presence)
    const awareness = provider.awareness;
    awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
    });

    const updateAwareness = () => {
      const users: CollabUser[] = [];
      awareness.getStates().forEach((state, clientId) => {
        const user = (state as Record<string, unknown>).user as
          | { name: string; color: string; cursor?: { x: number; y: number } }
          | undefined;
        if (user) {
          users.push({
            id: String(clientId),
            name: user.name,
            color: user.color,
            cursor: user.cursor,
          });
        }
      });
      setAwarenessUsers(users);
    };

    awareness.on('change', updateAwareness);
    updateAwareness();

    return () => {
      yFormulas.unobserve(syncFormulas);
      awareness.off('change', updateAwareness);
      provider.disconnect();
      ydoc.destroy();
      docRef.current = null;
      providerRef.current = null;
    };
  }, [documentId, userName, userColor]);

  const addFormulaFn = (entry: FormulaEntry) => {
    if (!docRef.current) return;
    const yFormulas = docRef.current.getArray<FormulaEntry>('formulas');
    yFormulas.push([entry]);
  };

  const removeFormulaFn = (id: string) => {
    if (!docRef.current) return;
    const yFormulas = docRef.current.getArray<FormulaEntry>('formulas');
    const items = yFormulas.toArray();
    const idx = items.findIndex((f) => f.id === id);
    if (idx !== -1) {
      yFormulas.delete(idx, 1);
    }
  };

  const updateFormulaFn = (entry: FormulaEntry) => {
    if (!docRef.current) return;
    const yFormulas = docRef.current.getArray<FormulaEntry>('formulas');
    const items = yFormulas.toArray();
    const idx = items.findIndex((f) => f.id === entry.id);
    if (idx !== -1) {
      docRef.current.transact(() => {
        yFormulas.delete(idx, 1);
        yFormulas.insert(idx, [entry]);
      });
    }
  };

  return {
    formulas,
    addFormula: addFormulaFn,
    removeFormula: removeFormulaFn,
    updateFormula: updateFormulaFn,
    awarenessUsers,
    connected,
  };
}
