import { useState, useMemo } from 'react';
import { fetchElement } from '../services/api';
import type { Atom } from '../types';

const ELEMENTS: { symbol: string; number: number; category: string }[] = [
  // Period 1
  { symbol: 'H', number: 1, category: 'nonmetal' },
  { symbol: 'He', number: 2, category: 'noble-gas' },
  // Period 2
  { symbol: 'Li', number: 3, category: 'alkali-metal' },
  { symbol: 'Be', number: 4, category: 'alkaline-earth' },
  { symbol: 'B', number: 5, category: 'metalloid' },
  { symbol: 'C', number: 6, category: 'nonmetal' },
  { symbol: 'N', number: 7, category: 'nonmetal' },
  { symbol: 'O', number: 8, category: 'nonmetal' },
  { symbol: 'F', number: 9, category: 'halogen' },
  { symbol: 'Ne', number: 10, category: 'noble-gas' },
  // Period 3
  { symbol: 'Na', number: 11, category: 'alkali-metal' },
  { symbol: 'Mg', number: 12, category: 'alkaline-earth' },
  { symbol: 'Al', number: 13, category: 'post-transition' },
  { symbol: 'Si', number: 14, category: 'metalloid' },
  { symbol: 'P', number: 15, category: 'nonmetal' },
  { symbol: 'S', number: 16, category: 'nonmetal' },
  { symbol: 'Cl', number: 17, category: 'halogen' },
  { symbol: 'Ar', number: 18, category: 'noble-gas' },
  // Period 4 (first 18)
  { symbol: 'K', number: 19, category: 'alkali-metal' },
  { symbol: 'Ca', number: 20, category: 'alkaline-earth' },
  { symbol: 'Sc', number: 21, category: 'transition-metal' },
  { symbol: 'Ti', number: 22, category: 'transition-metal' },
  { symbol: 'V', number: 23, category: 'transition-metal' },
  { symbol: 'Cr', number: 24, category: 'transition-metal' },
  { symbol: 'Mn', number: 25, category: 'transition-metal' },
  { symbol: 'Fe', number: 26, category: 'transition-metal' },
  { symbol: 'Co', number: 27, category: 'transition-metal' },
  { symbol: 'Ni', number: 28, category: 'transition-metal' },
  { symbol: 'Cu', number: 29, category: 'transition-metal' },
  { symbol: 'Zn', number: 30, category: 'transition-metal' },
  { symbol: 'Ga', number: 31, category: 'post-transition' },
  { symbol: 'Ge', number: 32, category: 'metalloid' },
  { symbol: 'As', number: 33, category: 'metalloid' },
  { symbol: 'Se', number: 34, category: 'nonmetal' },
  { symbol: 'Br', number: 35, category: 'halogen' },
  { symbol: 'Kr', number: 36, category: 'noble-gas' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'nonmetal': '#56b4e9',
  'noble-gas': '#cc79a7',
  'alkali-metal': '#e69f00',
  'alkaline-earth': '#f0e442',
  'metalloid': '#009e73',
  'halogen': '#0072b2',
  'transition-metal': '#d55e00',
  'post-transition': '#999999',
};

export default function PeriodicTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Atom | null>(null);
  const [loading, setLoading] = useState(false);

  const grid = useMemo(() => {
    const rows: { symbol: string; number: number; category: string; col: number; row: number }[] = [];
    // Manual row/col layout for the first few periods
    const layout: [number, number[]][] = [
      [0, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]],
      [1, [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10]],
      [2, [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18]],
      [3, [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]],
    ];

    for (const [row, cols] of layout) {
      for (let col = 0; col < cols.length; col++) {
        const num = cols[col];
        if (num === 0) continue;
        const el = ELEMENTS.find((e) => e.number === num);
        if (el) {
          rows.push({ ...el, col, row });
        }
      }
    }
    return rows;
  }, []);

  const handleClick = async (symbol: string) => {
    setLoading(true);
    try {
      const atom = await fetchElement(symbol);
      setSelectedElement(atom);
    } catch {
      setSelectedElement(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="periodic-table-wrapper">
      <button className="btn btn-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '▼ Hide Periodic Table' : '▶ Periodic Table'}
      </button>

      {isOpen && (
        <div className="periodic-table">
          <div className="periodic-grid">
            {grid.map((el) => (
              <button
                key={el.symbol}
                className="periodic-cell"
                style={{
                  gridColumn: el.col + 1,
                  gridRow: el.row + 1,
                  backgroundColor: CATEGORY_COLORS[el.category] || '#666',
                }}
                onClick={() => handleClick(el.symbol)}
                title={el.symbol}
              >
                <span className="periodic-number">{el.number}</span>
                <span className="periodic-symbol">{el.symbol}</span>
              </button>
            ))}
          </div>

          {loading && <div className="periodic-detail">Loading…</div>}

          {selectedElement && !loading && (
            <div className="periodic-detail">
              <h4>{selectedElement.name} ({selectedElement.symbol})</h4>
              <p>Atomic Number: {selectedElement.atomicNumber}</p>
              <p>Atomic Mass: {selectedElement.atomicMass.toFixed(4)} u</p>
              <p>Category: {selectedElement.category}</p>
              {selectedElement.electronegativity > 0 && (
                <p>Electronegativity: {selectedElement.electronegativity}</p>
              )}
            </div>
          )}

          <div className="periodic-legend">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <span key={cat} className="legend-item">
                <span className="legend-swatch" style={{ backgroundColor: color }} />
                {cat.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
