import { Router } from 'express';
import { parseFormula } from '../chemistry/formulaParser.js';
import { generateGeometry } from '../chemistry/geometryGenerator.js';
import { periodicTableArray, periodicTableMap } from '../chemistry/periodicTable.js';

const router = Router();

// POST /api/chemistry/parse - parse a formula string
router.post('/parse', (req, res) => {
  const { formula } = req.body as { formula?: string };

  if (!formula) {
    res.status(400).json({ error: 'formula is required' });
    return;
  }

  try {
    const parsed = parseFormula(formula);
    res.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse formula';
    res.status(400).json({ error: message });
  }
});

// POST /api/chemistry/geometry - generate 3D geometry for a formula
router.post('/geometry', (req, res) => {
  const { formula } = req.body as { formula?: string };

  if (!formula) {
    res.status(400).json({ error: 'formula is required' });
    return;
  }

  try {
    const parsed = parseFormula(formula);
    const geometry = generateGeometry(parsed);
    res.json({ parsed, geometry });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate geometry';
    res.status(400).json({ error: message });
  }
});

// GET /api/chemistry/elements - list all elements
router.get('/elements', (_req, res) => {
  res.json(periodicTableArray);
});

// GET /api/chemistry/elements/:symbol - get a specific element
router.get('/elements/:symbol', (req, res) => {
  const element = periodicTableMap.get(req.params.symbol);
  if (!element) {
    res.status(404).json({ error: `Element '${req.params.symbol}' not found` });
    return;
  }
  res.json(element);
});

export default router;
