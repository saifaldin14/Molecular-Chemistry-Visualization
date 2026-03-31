import { create } from 'zustand';
import type { ChemDocument, CollabUser, FormulaEntry, MoleculeGeometry } from '../types';

interface AppState {
  documents: ChemDocument[];
  currentDocument: ChemDocument | null;
  collaborators: CollabUser[];
  selectedFormula: FormulaEntry | null;
  moleculeGeometry: MoleculeGeometry | null;
  isLoading: boolean;
  error: string | null;

  setDocuments: (documents: ChemDocument[]) => void;
  setCurrentDocument: (document: ChemDocument | null) => void;
  addDocument: (document: ChemDocument) => void;
  updateDocument: (document: ChemDocument) => void;
  deleteDocument: (id: string) => void;
  setCollaborators: (collaborators: CollabUser[]) => void;
  addCollaborator: (collaborator: CollabUser) => void;
  removeCollaborator: (id: string) => void;
  setSelectedFormula: (formula: FormulaEntry | null) => void;
  setMoleculeGeometry: (geometry: MoleculeGeometry | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  documents: [],
  currentDocument: null,
  collaborators: [],
  selectedFormula: null,
  moleculeGeometry: null,
  isLoading: false,
  error: null,

  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (currentDocument) => set({ currentDocument }),
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  updateDocument: (document) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === document.id ? document : d)),
      currentDocument:
        state.currentDocument?.id === document.id ? document : state.currentDocument,
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
    })),
  setCollaborators: (collaborators) => set({ collaborators }),
  addCollaborator: (collaborator) =>
    set((state) => ({
      collaborators: state.collaborators.some((c) => c.id === collaborator.id)
        ? state.collaborators
        : [...state.collaborators, collaborator],
    })),
  removeCollaborator: (id) =>
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== id),
    })),
  setSelectedFormula: (selectedFormula) => set({ selectedFormula }),
  setMoleculeGeometry: (moleculeGeometry) => set({ moleculeGeometry }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
