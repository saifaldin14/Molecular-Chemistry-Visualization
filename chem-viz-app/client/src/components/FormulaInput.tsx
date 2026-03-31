import { useState } from 'react';
import { parseFormula } from '../services/api';
import type { ParsedMolecule } from '../types';

interface FormulaInputProps {
  onAdd: (formula: string, name: string, notes: string) => void;
  disabled?: boolean;
}

export default function FormulaInput({ onAdd, disabled }: FormulaInputProps) {
  const [formula, setFormula] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [parsed, setParsed] = useState<ParsedMolecule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleParse = async () => {
    if (!formula.trim()) return;
    setParsing(true);
    setError(null);
    setParsed(null);
    try {
      const result = await parseFormula(formula.trim());
      setParsed(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse formula');
    } finally {
      setParsing(false);
    }
  };

  const handleAdd = () => {
    if (!formula.trim()) return;
    onAdd(formula.trim(), name.trim(), notes.trim());
    setFormula('');
    setName('');
    setNotes('');
    setParsed(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleParse();
    }
  };

  return (
    <div className="formula-input">
      <h3 className="formula-input-title">Add Formula</h3>

      <div className="formula-input-row">
        <input
          type="text"
          className="input formula-field"
          placeholder="e.g. H2O, CH4, C6H12O6"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          className="btn btn-secondary"
          onClick={handleParse}
          disabled={!formula.trim() || parsing || disabled}
        >
          {parsing ? 'Parsing…' : 'Parse'}
        </button>
      </div>

      <input
        type="text"
        className="input"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />

      <textarea
        className="input textarea"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        disabled={disabled}
      />

      {error && <div className="formula-error">{error}</div>}

      {parsed && (
        <div className="formula-parsed">
          <div className="parsed-info">
            <span className="parsed-formula">{parsed.formula}</span>
            <span className="parsed-weight">
              {parsed.molecularWeight.toFixed(2)} g/mol
            </span>
          </div>
          <div className="parsed-atoms">
            {parsed.atoms.map((a) => (
              <span key={a.symbol} className="parsed-atom-badge">
                {a.symbol}<sub>{a.count > 1 ? a.count : ''}</sub>
              </span>
            ))}
          </div>
          <div className="parsed-meta">
            Total atoms: {parsed.totalAtoms} · Bonds: {parsed.bonds.length}
          </div>
        </div>
      )}

      <button
        className="btn btn-primary btn-add"
        onClick={handleAdd}
        disabled={!formula.trim() || disabled}
      >
        Add to Document
      </button>
    </div>
  );
}
