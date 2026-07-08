import { describe, it, expect } from 'vitest';
import { generateGeometry } from '../geometryGenerator.js';
import { parseFormula } from '../formulaParser.js';

describe('generateGeometry', () => {
  describe('single atom', () => {
    it('places single atom at origin', () => {
      const parsed = parseFormula('He');
      const geometry = generateGeometry(parsed);

      expect(geometry.atoms).toHaveLength(1);
      expect(geometry.atoms[0].position).toEqual([0, 0, 0]);
      expect(geometry.atoms[0].symbol).toBe('He');
      expect(geometry.bonds).toHaveLength(0);
    });
  });

  describe('diatomic molecules', () => {
    it('generates geometry for O2', () => {
      const parsed = parseFormula('O2');
      const geometry = generateGeometry(parsed);

      expect(geometry.atoms).toHaveLength(2);
      expect(geometry.bonds).toHaveLength(1);
    });

    it('generates geometry for HCl', () => {
      const parsed = parseFormula('HCl');
      const geometry = generateGeometry(parsed);

      expect(geometry.atoms).toHaveLength(2);
      expect(geometry.bonds).toHaveLength(1);
    });
  });

  describe('multi-atom molecules', () => {
    it('generates geometry for H2O (3 atoms)', () => {
      const parsed = parseFormula('H2O');
      const geometry = generateGeometry(parsed);

      expect(geometry.atoms).toHaveLength(3);
      expect(geometry.bonds).toHaveLength(2);

      // Central atom should be at origin
      const centralAtom = geometry.atoms[0];
      expect(centralAtom.position).toEqual([0, 0, 0]);
    });

    it('generates geometry for CH4 (5 atoms, tetrahedral)', () => {
      const parsed = parseFormula('CH4');
      const geometry = generateGeometry(parsed);

      expect(geometry.atoms).toHaveLength(5);
      expect(geometry.bonds).toHaveLength(4);
    });

    it('generates geometry for CO2 (3 atoms, linear)', () => {
      const parsed = parseFormula('CO2');
      const geometry = generateGeometry(parsed);

      expect(geometry.atoms).toHaveLength(3);
      expect(geometry.bonds).toHaveLength(2);
    });
  });

  describe('atom properties', () => {
    it('assigns correct colors to atoms', () => {
      const parsed = parseFormula('H2O');
      const geometry = generateGeometry(parsed);

      for (const atom of geometry.atoms) {
        expect(atom.color).toBeTruthy();
        expect(atom.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });

    it('assigns positive radius to all atoms', () => {
      const parsed = parseFormula('NaCl');
      const geometry = generateGeometry(parsed);

      for (const atom of geometry.atoms) {
        expect(atom.radius).toBeGreaterThan(0);
      }
    });
  });

  describe('bond properties', () => {
    it('bonds have valid start and end positions', () => {
      const parsed = parseFormula('H2O');
      const geometry = generateGeometry(parsed);

      for (const bond of geometry.bonds) {
        expect(bond.start).toHaveLength(3);
        expect(bond.end).toHaveLength(3);
        expect(bond.order).toBeGreaterThanOrEqual(1);
      }
    });

    it('bond starts at origin (central atom)', () => {
      const parsed = parseFormula('CH4');
      const geometry = generateGeometry(parsed);

      for (const bond of geometry.bonds) {
        expect(bond.start).toEqual([0, 0, 0]);
      }
    });
  });

  describe('empty input', () => {
    it('handles parsed molecule with no atoms gracefully', () => {
      const geometry = generateGeometry({
        formula: '',
        atoms: [],
        totalAtoms: 0,
        molecularWeight: 0,
        bonds: [],
      });

      expect(geometry.atoms).toHaveLength(0);
      expect(geometry.bonds).toHaveLength(0);
    });
  });
});
