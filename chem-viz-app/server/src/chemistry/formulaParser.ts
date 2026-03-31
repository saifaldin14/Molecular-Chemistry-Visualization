import type { ParsedMolecule, Bond } from '../types.js';
import { periodicTableMap } from './periodicTable.js';

interface AtomCount {
  symbol: string;
  count: number;
}

/**
 * Tokenize a chemical formula into element symbols, numbers, and parentheses.
 */
function tokenize(formula: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < formula.length) {
    const ch = formula[i];

    if (ch === '(' || ch === ')') {
      tokens.push(ch);
      i++;
    } else if (ch >= 'A' && ch <= 'Z') {
      // Element symbol: uppercase letter optionally followed by lowercase
      let symbol = ch;
      i++;
      while (i < formula.length && formula[i] >= 'a' && formula[i] <= 'z') {
        symbol += formula[i];
        i++;
      }
      tokens.push(symbol);
    } else if (ch >= '0' && ch <= '9') {
      let num = '';
      while (i < formula.length && formula[i] >= '0' && formula[i] <= '9') {
        num += formula[i];
        i++;
      }
      tokens.push(num);
    } else {
      throw new Error(`Unexpected character '${ch}' in formula '${formula}'`);
    }
  }

  return tokens;
}

/**
 * Parse tokens into a flat list of { symbol, count } entries.
 * Handles nested parentheses by using a stack.
 */
function parseTokens(tokens: string[]): Map<string, number> {
  const stack: Map<string, number>[] = [new Map()];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token === '(') {
      stack.push(new Map());
      i++;
    } else if (token === ')') {
      i++;
      let multiplier = 1;
      if (i < tokens.length && /^\d+$/.test(tokens[i])) {
        multiplier = parseInt(tokens[i], 10);
        i++;
      }
      const top = stack.pop()!;
      const current = stack[stack.length - 1];
      for (const [symbol, count] of top) {
        current.set(symbol, (current.get(symbol) ?? 0) + count * multiplier);
      }
    } else if (/^[A-Z][a-z]*$/.test(token)) {
      // Element symbol
      if (!periodicTableMap.has(token)) {
        throw new Error(`Unknown element symbol '${token}'`);
      }
      i++;
      let count = 1;
      if (i < tokens.length && /^\d+$/.test(tokens[i])) {
        count = parseInt(tokens[i], 10);
        i++;
      }
      const current = stack[stack.length - 1];
      current.set(token, (current.get(token) ?? 0) + count);
    } else {
      i++;
    }
  }

  if (stack.length !== 1) {
    throw new Error('Mismatched parentheses in formula');
  }

  return stack[0];
}

/**
 * Generate simple bonds for the molecule.
 * Uses a basic heuristic: the first unique element type is the central atom,
 * and all other atoms bond to it.
 */
function generateBonds(atomList: AtomCount[]): Bond[] {
  const bonds: Bond[] = [];

  // Expand atom list into individual atom indices
  const expandedAtoms: string[] = [];
  for (const { symbol, count } of atomList) {
    for (let i = 0; i < count; i++) {
      expandedAtoms.push(symbol);
    }
  }

  if (expandedAtoms.length <= 1) return bonds;

  // Find the central atom (least electronegative non-hydrogen, or first atom)
  let centralIndex = 0;
  if (expandedAtoms.length > 2) {
    let minEN = Infinity;
    for (let i = 0; i < expandedAtoms.length; i++) {
      const el = periodicTableMap.get(expandedAtoms[i]);
      if (el && el.symbol !== 'H' && el.electronegativity > 0 && el.electronegativity < minEN) {
        minEN = el.electronegativity;
        centralIndex = i;
      }
    }
  }

  // Connect all other atoms to the central atom
  for (let i = 0; i < expandedAtoms.length; i++) {
    if (i !== centralIndex) {
      bonds.push({ atom1Index: centralIndex, atom2Index: i, order: 1 });
    }
  }

  return bonds;
}

/**
 * Parse a chemical formula string and return a ParsedMolecule.
 */
export function parseFormula(formula: string): ParsedMolecule {
  if (!formula || formula.trim().length === 0) {
    throw new Error('Formula cannot be empty');
  }

  const tokens = tokenize(formula.trim());
  const atomMap = parseTokens(tokens);

  const atoms: AtomCount[] = [];
  let totalAtoms = 0;
  let molecularWeight = 0;

  for (const [symbol, count] of atomMap) {
    atoms.push({ symbol, count });
    totalAtoms += count;

    const element = periodicTableMap.get(symbol);
    if (element) {
      molecularWeight += element.atomicMass * count;
    }
  }

  const bonds = generateBonds(atoms);

  return {
    formula: formula.trim(),
    atoms,
    totalAtoms,
    molecularWeight: Math.round(molecularWeight * 1000) / 1000,
    bonds,
  };
}
