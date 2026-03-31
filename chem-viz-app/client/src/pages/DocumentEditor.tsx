import { useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '../store/appStore';
import {
  fetchDocument,
  deleteDocument as apiDeleteDocument,
  addFormula as apiAddFormula,
  removeFormula as apiRemoveFormula,
  generateGeometry,
} from '../services/api';
import {
  connectSocket,
  disconnectSocket,
  joinDocument,
  leaveDocument,
} from '../services/socket';
import { useCollaboration } from '../hooks/useCollaboration';
import MoleculeViewer from '../components/MoleculeViewer';
import FormulaInput from '../components/FormulaInput';
import FormulaList from '../components/FormulaList';
import CollaboratorBar from '../components/CollaboratorBar';
import PeriodicTable from '../components/PeriodicTable';
import type { FormulaEntry } from '../types';

const USER_NAME = `User-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0, 4)}`;
const USER_COLOR = `hsl(${crypto.getRandomValues(new Uint8Array(1))[0]}, 70%, 60%)`;

export default function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentDocument,
    setCurrentDocument,
    selectedFormula,
    setSelectedFormula,
    moleculeGeometry,
    setMoleculeGeometry,
    isLoading,
    setLoading,
    error,
    setError,
  } = useAppStore();

  const { formulas: collabFormulas, addFormula: collabAdd, removeFormula: collabRemove, awarenessUsers, connected } =
    useCollaboration(id, USER_NAME, USER_COLOR);

  // Merge formulas: prefer collab formulas when available, fallback to document formulas
  const formulas: FormulaEntry[] = useMemo(
    () => (collabFormulas.length > 0 ? collabFormulas : currentDocument?.formulas ?? []),
    [collabFormulas, currentDocument?.formulas],
  );

  // Load document
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await fetchDocument(id);
        if (!cancelled) setCurrentDocument(doc);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, setCurrentDocument, setLoading, setError]);

  // Socket.IO connection
  useEffect(() => {
    if (!id) return;
    connectSocket();
    joinDocument(id, USER_NAME);
    return () => {
      leaveDocument(id);
      disconnectSocket();
    };
  }, [id]);

  // Generate geometry for selected formula
  useEffect(() => {
    if (!selectedFormula) {
      setMoleculeGeometry(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const geo = await generateGeometry(selectedFormula.formula);
        if (!cancelled) setMoleculeGeometry(geo);
      } catch {
        if (!cancelled) setMoleculeGeometry(null);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedFormula, setMoleculeGeometry]);

  const handleAddFormula = useCallback(
    async (formula: string, name: string, notes: string) => {
      if (!id) return;
      const entry: FormulaEntry = {
        id: uuidv4(),
        formula,
        name,
        notes,
        position: { x: 0, y: 0 },
        addedBy: USER_NAME,
        addedAt: new Date().toISOString(),
      };
      try {
        await apiAddFormula(id, entry);
        collabAdd(entry);
        // Re-fetch document to stay in sync
        const doc = await fetchDocument(id);
        setCurrentDocument(doc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add formula');
      }
    },
    [id, collabAdd, setCurrentDocument, setError],
  );

  const handleDeleteFormula = useCallback(
    async (formulaId: string) => {
      if (!id) return;
      try {
        await apiRemoveFormula(id, formulaId);
        collabRemove(formulaId);
        if (selectedFormula?.id === formulaId) {
          setSelectedFormula(null);
          setMoleculeGeometry(null);
        }
        const doc = await fetchDocument(id);
        setCurrentDocument(doc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete formula');
      }
    },
    [id, collabRemove, selectedFormula, setSelectedFormula, setMoleculeGeometry, setCurrentDocument, setError],
  );

  const handleDeleteDocument = async () => {
    if (!id) return;
    try {
      await apiDeleteDocument(id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  if (isLoading) {
    return (
      <div className="page loading-state">
        <div className="spinner" />
        <p>Loading document…</p>
      </div>
    );
  }

  if (error && !currentDocument) {
    return (
      <div className="page error-state">
        <p className="error-banner">{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back to Documents
        </button>
      </div>
    );
  }

  return (
    <div className="page editor-page">
      <header className="editor-header">
        <div className="editor-header-left">
          <button className="btn btn-back" onClick={() => navigate('/')}>
            ←
          </button>
          <h1 className="editor-title">{currentDocument?.title ?? 'Document'}</h1>
        </div>
        <div className="editor-header-right">
          <CollaboratorBar collaborators={awarenessUsers} connected={connected} />
          <button className="btn btn-danger" onClick={handleDeleteDocument} title="Delete document">
            🗑️
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="editor-body">
        <aside className="editor-sidebar">
          <FormulaInput onAdd={handleAddFormula} />
          <FormulaList
            formulas={formulas}
            selectedId={selectedFormula?.id ?? null}
            onSelect={setSelectedFormula}
            onDelete={handleDeleteFormula}
          />
          <PeriodicTable />
        </aside>

        <main className="editor-main">
          <MoleculeViewer geometry={moleculeGeometry} />
        </main>
      </div>
    </div>
  );
}
