import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments, createDocument } from '../services/api';
import { useAppStore } from '../store/appStore';

export default function DocumentList() {
  const navigate = useNavigate();
  const { documents, setDocuments, setLoading, setError, isLoading, error } = useAppStore();
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setDocuments, setLoading, setError]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const doc = await createDocument(newTitle.trim(), 'user');
      setDocuments([...documents, doc]);
      setNewTitle('');
      navigate(`/document/${doc.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
  };

  return (
    <div className="page document-list-page">
      <header className="page-header">
        <h1 className="page-title">
          <span className="title-icon">⚗️</span> Chemistry Visualizer
        </h1>
        <p className="page-subtitle">Collaborative molecular visualization workspace</p>
      </header>

      <div className="create-document-bar">
        <input
          type="text"
          className="input create-input"
          placeholder="New document title…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={!newTitle.trim() || creating}
        >
          {creating ? 'Creating…' : '+ New Document'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading documents…</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📄</span>
          <p>No documents yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="document-grid">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="document-card"
              onClick={() => navigate(`/document/${doc.id}`)}
            >
              <h3 className="document-card-title">{doc.title}</h3>
              <div className="document-card-meta">
                <span>{doc.formulas.length} formula{doc.formulas.length !== 1 ? 's' : ''}</span>
                <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="document-card-footer">
                <span className="document-card-owner">Owner: {doc.owner}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
