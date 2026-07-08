import { Router } from 'express';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { ChemDocument, FormulaEntry } from '../types.js';

const router = Router();

const MAX_TITLE_LENGTH = 200;
const MAX_OWNER_LENGTH = 100;

const documents = new Map<string, ChemDocument>();

function validateTitle(title: string, res: Response): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    res.status(400).json({ error: 'title cannot be empty' });
    return null;
  }
  if (trimmed.length > MAX_TITLE_LENGTH) {
    res.status(400).json({ error: `title exceeds maximum length of ${MAX_TITLE_LENGTH} characters` });
    return null;
  }
  return trimmed;
}

// GET /api/documents - list all documents
router.get('/', (_req, res) => {
  const docs = Array.from(documents.values());
  res.json(docs);
});

// POST /api/documents - create a new document
router.post('/', (req, res) => {
  const { title, owner } = req.body as { title?: string; owner?: string };

  if (!title || !owner) {
    res.status(400).json({ error: 'title and owner are required' });
    return;
  }

  const trimmedTitle = validateTitle(title, res);
  if (trimmedTitle === null) return;

  const trimmedOwner = owner.trim();

  if (trimmedOwner.length > MAX_OWNER_LENGTH) {
    res.status(400).json({ error: `owner exceeds maximum length of ${MAX_OWNER_LENGTH} characters` });
    return;
  }

  const now = new Date().toISOString();
  const doc: ChemDocument = {
    id: uuidv4(),
    title: trimmedTitle,
    createdAt: now,
    updatedAt: now,
    owner: trimmedOwner,
    collaborators: [],
    formulas: [],
  };

  documents.set(doc.id, doc);
  res.status(201).json(doc);
});

// GET /api/documents/:id - get a specific document
router.get('/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json(doc);
});

// PUT /api/documents/:id - update a document
router.put('/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }

  const { title, collaborators } = req.body as {
    title?: string;
    collaborators?: string[];
  };

  if (title !== undefined) {
    const trimmedTitle = validateTitle(title, res);
    if (trimmedTitle === null) return;
    doc.title = trimmedTitle;
  }
  if (collaborators !== undefined) doc.collaborators = collaborators;
  doc.updatedAt = new Date().toISOString();

  documents.set(doc.id, doc);
  res.json(doc);
});

// DELETE /api/documents/:id - delete a document
router.delete('/:id', (req, res) => {
  if (!documents.has(req.params.id)) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  documents.delete(req.params.id);
  res.status(204).send();
});

// POST /api/documents/:id/formulas - add a formula to a document
router.post('/:id/formulas', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }

  const { formula, name, notes, position, addedBy } = req.body as {
    formula?: string;
    name?: string;
    notes?: string;
    position?: { x: number; y: number };
    addedBy?: string;
  };

  if (!formula || !addedBy) {
    res.status(400).json({ error: 'formula and addedBy are required' });
    return;
  }

  const entry: FormulaEntry = {
    id: uuidv4(),
    formula,
    name: name ?? '',
    notes: notes ?? '',
    position: position ?? { x: 0, y: 0 },
    addedBy,
    addedAt: new Date().toISOString(),
  };

  doc.formulas.push(entry);
  doc.updatedAt = new Date().toISOString();
  documents.set(doc.id, doc);

  res.status(201).json(entry);
});

// DELETE /api/documents/:id/formulas/:formulaId - remove a formula
router.delete('/:id/formulas/:formulaId', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }

  const formulaIndex = doc.formulas.findIndex((f) => f.id === req.params.formulaId);
  if (formulaIndex === -1) {
    res.status(404).json({ error: 'Formula not found' });
    return;
  }

  doc.formulas.splice(formulaIndex, 1);
  doc.updatedAt = new Date().toISOString();
  documents.set(doc.id, doc);

  res.status(204).send();
});

export default router;
