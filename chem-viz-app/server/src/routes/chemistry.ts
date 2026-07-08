import { Router } from 'express';
import type { Response } from 'express';
import { parseFormula } from '../chemistry/formulaParser.js';
import { generateGeometry } from '../chemistry/geometryGenerator.js';
import { periodicTableArray, periodicTableMap } from '../chemistry/periodicTable.js';

const router = Router();

const MAX_FORMULA_LENGTH = 500;

function validateFormula(formula: string | undefined, res: Response): string | null {
  if (!formula) {
    res.status(400).json({ error: 'formula is required' });
    return null;
  }
  const trimmed = formula.trim();
  if (trimmed.length > MAX_FORMULA_LENGTH) {
    res.status(400).json({ error: `Formula exceeds maximum length of ${MAX_FORMULA_LENGTH} characters` });
    return null;
  }
  return trimmed;
}

// POST /api/chemistry/parse - parse a formula string
router.post('/parse', (req, res) => {
  const trimmedFormula = validateFormula((req.body as { formula?: string }).formula, res);
  if (trimmedFormula === null) return;

  try {
    const parsed = parseFormula(trimmedFormula);
    res.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse formula';
    res.status(400).json({ error: message });
  }
});

// POST /api/chemistry/geometry - generate 3D geometry for a formula
router.post('/geometry', (req, res) => {
  const trimmedFormula = validateFormula((req.body as { formula?: string }).formula, res);
  if (trimmedFormula === null) return;

  try {
    const parsed = parseFormula(trimmedFormula);
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
