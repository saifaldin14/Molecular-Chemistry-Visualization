import { describe, it, expect } from 'vitest';
import { parseFormula } from '../formulaParser.js';

describe('parseFormula', () => {
  describe('simple formulas', () => {
    it('parses a single element', () => {
      const result = parseFormula('H');
      expect(result.formula).toBe('H');
      expect(result.totalAtoms).toBe(1);
      expect(result.atoms).toEqual([{ symbol: 'H', count: 1 }]);
    });

    it('parses element with count', () => {
      const result = parseFormula('O2');
      expect(result.formula).toBe('O2');
      expect(result.totalAtoms).toBe(2);
      expect(result.atoms).toEqual([{ symbol: 'O', count: 2 }]);
    });

    it('parses water (H2O)', () => {
      const result = parseFormula('H2O');
      expect(result.formula).toBe('H2O');
      expect(result.totalAtoms).toBe(3);
      expect(result.atoms).toContainEqual({ symbol: 'H', count: 2 });
      expect(result.atoms).toContainEqual({ symbol: 'O', count: 1 });
    });

    it('parses carbon dioxide (CO2)', () => {
      const result = parseFormula('CO2');
      expect(result.totalAtoms).toBe(3);
      expect(result.atoms).toContainEqual({ symbol: 'C', count: 1 });
      expect(result.atoms).toContainEqual({ symbol: 'O', count: 2 });
    });

    it('parses methane (CH4)', () => {
      const result = parseFormula('CH4');
      expect(result.totalAtoms).toBe(5);
      expect(result.atoms).toContainEqual({ symbol: 'C', count: 1 });
      expect(result.atoms).toContainEqual({ symbol: 'H', count: 4 });
    });
  });

  describe('formulas with parentheses', () => {
    it('parses Ca(OH)2', () => {
      const result = parseFormula('Ca(OH)2');
      expect(result.atoms).toContainEqual({ symbol: 'Ca', count: 1 });
      expect(result.atoms).toContainEqual({ symbol: 'O', count: 2 });
      expect(result.atoms).toContainEqual({ symbol: 'H', count: 2 });
      expect(result.totalAtoms).toBe(5);
    });

    it('parses Mg(OH)2', () => {
      const result = parseFormula('Mg(OH)2');
      expect(result.totalAtoms).toBe(5);
    });
  });

  describe('molecular weight calculation', () => {
    it('calculates molecular weight for H2O', () => {
      const result = parseFormula('H2O');
      // H: 1.008 * 2 = 2.016, O: 15.999 -> 18.015
      expect(result.molecularWeight).toBeCloseTo(18.015, 2);
    });

    it('calculates molecular weight for NaCl', () => {
      const result = parseFormula('NaCl');
      // Na: 22.990, Cl: 35.453 -> 58.443
      expect(result.molecularWeight).toBeCloseTo(58.443, 2);
    });
  });

  describe('bond generation', () => {
    it('generates no bonds for single atom', () => {
      const result = parseFormula('He');
      expect(result.bonds).toHaveLength(0);
    });

    it('generates bonds for multi-atom molecules', () => {
      const result = parseFormula('H2O');
      expect(result.bonds.length).toBeGreaterThan(0);
    });

    it('bonds have valid atom indices', () => {
      const result = parseFormula('CH4');
      for (const bond of result.bonds) {
        expect(bond.atom1Index).toBeGreaterThanOrEqual(0);
        expect(bond.atom2Index).toBeGreaterThanOrEqual(0);
        expect(bond.order).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('error handling', () => {
    it('throws on empty formula', () => {
      expect(() => parseFormula('')).toThrow('Formula cannot be empty');
    });

    it('throws on whitespace-only formula', () => {
      expect(() => parseFormula('   ')).toThrow('Formula cannot be empty');
    });

    it('throws on unknown element', () => {
      expect(() => parseFormula('Xx')).toThrow("Unknown element symbol 'Xx'");
    });

    it('throws on invalid characters', () => {
      expect(() => parseFormula('H2O!')).toThrow("Unexpected character '!'");
    });

    it('throws on mismatched parentheses', () => {
      expect(() => parseFormula('Ca(OH')).toThrow('Mismatched parentheses');
    });
  });

  describe('whitespace handling', () => {
    it('trims leading/trailing whitespace', () => {
      const result = parseFormula('  H2O  ');
      expect(result.formula).toBe('H2O');
      expect(result.totalAtoms).toBe(3);
    });
  });
});
