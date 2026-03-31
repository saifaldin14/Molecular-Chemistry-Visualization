import type { FormulaEntry } from '../types';

interface FormulaListProps {
  formulas: FormulaEntry[];
  selectedId: string | null;
  onSelect: (formula: FormulaEntry) => void;
  onDelete: (id: string) => void;
}

export default function FormulaList({ formulas, selectedId, onSelect, onDelete }: FormulaListProps) {
  if (formulas.length === 0) {
    return (
      <div className="formula-list-empty">
        <p>No formulas yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="formula-list">
      <h3 className="formula-list-title">Formulas</h3>
      <ul className="formula-list-items">
        {formulas.map((f) => (
          <li
            key={f.id}
            className={`formula-list-item ${selectedId === f.id ? 'selected' : ''}`}
            onClick={() => onSelect(f)}
          >
            <div className="formula-list-item-main">
              <span className="formula-list-formula">{f.formula}</span>
              {f.name && <span className="formula-list-name">{f.name}</span>}
            </div>
            <div className="formula-list-item-meta">
              <span className="formula-list-author">by {f.addedBy || 'unknown'}</span>
              <button
                className="btn-icon btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(f.id);
                }}
                title="Remove formula"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
