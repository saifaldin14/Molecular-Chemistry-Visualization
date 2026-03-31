import { WebSocketServer, WebSocket } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import type { IncomingMessage } from 'http';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

interface YjsConnection {
  ws: WebSocket;
  docName: string;
}

const docs = new Map<string, Y.Doc>();
const connections = new Map<WebSocket, YjsConnection>();
const awarenessMap = new Map<string, awarenessProtocol.Awareness>();

function getOrCreateDoc(docName: string): Y.Doc {
  let doc = docs.get(docName);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docName, doc);
    awarenessMap.set(docName, new awarenessProtocol.Awareness(doc));
  }
  return doc;
}

function getAwareness(docName: string): awarenessProtocol.Awareness {
  let awareness = awarenessMap.get(docName);
  if (!awareness) {
    const doc = getOrCreateDoc(docName);
    awareness = new awarenessProtocol.Awareness(doc);
    awarenessMap.set(docName, awareness);
  }
  return awareness;
}

function sendMessage(ws: WebSocket, message: Uint8Array): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
}

function handleMessage(ws: WebSocket, message: Uint8Array, docName: string): void {
  try {
    const doc = getOrCreateDoc(docName);
    const decoder = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(decoder);

    switch (messageType) {
      case MESSAGE_SYNC: {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        syncProtocol.readSyncMessage(decoder, encoder, doc, ws);
        const responseMessage = encoding.toUint8Array(encoder);
        if (encoding.length(encoder) > 1) {
          sendMessage(ws, responseMessage);
        }
        break;
      }
      case MESSAGE_AWARENESS: {
        const awareness = getAwareness(docName);
        awarenessProtocol.applyAwarenessUpdate(
          awareness,
          decoding.readVarUint8Array(decoder),
          ws
        );
        // Broadcast awareness update to all other clients
        const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
          awareness,
          Array.from(awareness.getStates().keys())
        );
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(encoder, awarenessUpdate);
        const awarenessMessage = encoding.toUint8Array(encoder);

        for (const [clientWs, conn] of connections) {
          if (conn.docName === docName && clientWs !== ws) {
            sendMessage(clientWs, awarenessMessage);
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error('[YjsServer] Error handling message:', err);
  }
}

function broadcastUpdate(docName: string, update: Uint8Array, origin: unknown): void {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);

  for (const [ws, conn] of connections) {
    if (conn.docName === docName && ws !== origin) {
      sendMessage(ws, message);
    }
  }
}

export function setupYjsServer(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    // Extract document name from URL path (e.g., /my-doc)
    const docName = req.url?.slice(1) ?? 'default';
    const doc = getOrCreateDoc(docName);

    connections.set(ws, { ws, docName });

    // Listen for document updates and broadcast to peers
    const updateHandler = (update: Uint8Array, origin: unknown) => {
      broadcastUpdate(docName, update, origin);
    };
    doc.on('update', updateHandler);

    // Send initial sync step 1 to the new client
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MESSAGE_SYNC);
    syncProtocol.writeSyncStep1(encoder, doc);
    sendMessage(ws, encoding.toUint8Array(encoder));

    // Send current awareness state
    const awareness = getAwareness(docName);
    const states = awareness.getStates();
    if (states.size > 0) {
      const awarenessEncoder = encoding.createEncoder();
      encoding.writeVarUint(awarenessEncoder, MESSAGE_AWARENESS);
      encoding.writeVarUint8Array(
        awarenessEncoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(states.keys()))
      );
      sendMessage(ws, encoding.toUint8Array(awarenessEncoder));
    }

    ws.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
      const message = data instanceof Buffer
        ? new Uint8Array(data)
        : new Uint8Array(data as ArrayBuffer);
      handleMessage(ws, message, docName);
    });

    ws.on('close', () => {
      connections.delete(ws);
      doc.off('update', updateHandler);

      // Clean up awareness for this client
      const awareness = getAwareness(docName);
      awarenessProtocol.removeAwarenessStates(awareness, [doc.clientID], null);

      console.log(`[YjsServer] Client disconnected from document '${docName}'`);
    });

    ws.on('error', (err) => {
      console.error(`[YjsServer] WebSocket error for document '${docName}':`, err);
    });

    console.log(`[YjsServer] Client connected to document '${docName}'`);
  });

  console.log(`[YjsServer] Yjs WebSocket server listening on port ${port}`);
  return wss;
}
