export interface ChemDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  collaborators: string[];
  formulas: FormulaEntry[];
}

export interface FormulaEntry {
  id: string;
  formula: string;
  name: string;
  notes: string;
  position: { x: number; y: number };
  addedBy: string;
  addedAt: string;
}

export interface Atom {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  electronegativity: number;
  group: number;
  period: number;
  category: string;
  color: string;
  radius: number;
}

export interface ParsedMolecule {
  formula: string;
  atoms: { symbol: string; count: number }[];
  totalAtoms: number;
  molecularWeight: number;
  bonds: Bond[];
}

export interface Bond {
  atom1Index: number;
  atom2Index: number;
  order: number;
}

export interface MoleculeGeometry {
  atoms: AtomPosition[];
  bonds: BondGeometry[];
}

export interface AtomPosition {
  symbol: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

export interface BondGeometry {
  start: [number, number, number];
  end: [number, number, number];
  order: number;
}

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

export interface CollabMessage {
  type: 'join' | 'leave' | 'cursor-move' | 'formula-add' | 'formula-update' | 'formula-delete';
  userId: string;
  userName: string;
  documentId: string;
  payload?: unknown;
}
