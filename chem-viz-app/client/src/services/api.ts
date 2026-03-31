import type {
  ChemDocument,
  FormulaEntry,
  ParsedMolecule,
  MoleculeGeometry,
  Atom,
} from '../types';

const API_BASE = 'http://localhost:3001';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Document CRUD
export function fetchDocuments(): Promise<ChemDocument[]> {
  return request<ChemDocument[]>('/api/documents');
}

export function createDocument(title: string, owner: string): Promise<ChemDocument> {
  return request<ChemDocument>('/api/documents', {
    method: 'POST',
    body: JSON.stringify({ title, owner }),
  });
}

export function fetchDocument(id: string): Promise<ChemDocument> {
  return request<ChemDocument>(`/api/documents/${id}`);
}

export function updateDocument(
  id: string,
  data: Partial<Pick<ChemDocument, 'title' | 'collaborators'>>,
): Promise<ChemDocument> {
  return request<ChemDocument>(`/api/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteDocument(id: string): Promise<void> {
  return request<void>(`/api/documents/${id}`, { method: 'DELETE' });
}

// Formulas
export function addFormula(
  documentId: string,
  formula: Omit<FormulaEntry, 'id' | 'addedAt'>,
): Promise<FormulaEntry> {
  return request<FormulaEntry>(`/api/documents/${documentId}/formulas`, {
    method: 'POST',
    body: JSON.stringify(formula),
  });
}

export function removeFormula(documentId: string, formulaId: string): Promise<void> {
  return request<void>(`/api/documents/${documentId}/formulas/${formulaId}`, {
    method: 'DELETE',
  });
}

// Chemistry
export function parseFormula(formula: string): Promise<ParsedMolecule> {
  return request<ParsedMolecule>('/api/chemistry/parse', {
    method: 'POST',
    body: JSON.stringify({ formula }),
  });
}

export function generateGeometry(formula: string): Promise<MoleculeGeometry> {
  return request<MoleculeGeometry>('/api/chemistry/geometry', {
    method: 'POST',
    body: JSON.stringify({ formula }),
  });
}

export function fetchElements(): Promise<Atom[]> {
  return request<Atom[]>('/api/chemistry/elements');
}

export function fetchElement(symbol: string): Promise<Atom> {
  return request<Atom>(`/api/chemistry/elements/${symbol}`);
}
