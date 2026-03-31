import type { Atom } from '../types.js';

const elements: Atom[] = [
  { symbol: 'H',  name: 'Hydrogen',   atomicNumber: 1,  atomicMass: 1.008,   electronegativity: 2.20, group: 1,  period: 1, category: 'nonmetal',            color: '#FFFFFF', radius: 120 },
  { symbol: 'He', name: 'Helium',     atomicNumber: 2,  atomicMass: 4.003,   electronegativity: 0,    group: 18, period: 1, category: 'noble gas',            color: '#D9FFFF', radius: 140 },
  { symbol: 'Li', name: 'Lithium',    atomicNumber: 3,  atomicMass: 6.941,   electronegativity: 0.98, group: 1,  period: 2, category: 'alkali metal',         color: '#CC80FF', radius: 182 },
  { symbol: 'Be', name: 'Beryllium',  atomicNumber: 4,  atomicMass: 9.012,   electronegativity: 1.57, group: 2,  period: 2, category: 'alkaline earth metal', color: '#C2FF00', radius: 153 },
  { symbol: 'B',  name: 'Boron',      atomicNumber: 5,  atomicMass: 10.81,   electronegativity: 2.04, group: 13, period: 2, category: 'metalloid',            color: '#FFB5B5', radius: 192 },
  { symbol: 'C',  name: 'Carbon',     atomicNumber: 6,  atomicMass: 12.011,  electronegativity: 2.55, group: 14, period: 2, category: 'nonmetal',             color: '#909090', radius: 170 },
  { symbol: 'N',  name: 'Nitrogen',   atomicNumber: 7,  atomicMass: 14.007,  electronegativity: 3.04, group: 15, period: 2, category: 'nonmetal',             color: '#3050F8', radius: 155 },
  { symbol: 'O',  name: 'Oxygen',     atomicNumber: 8,  atomicMass: 15.999,  electronegativity: 3.44, group: 16, period: 2, category: 'nonmetal',             color: '#FF0D0D', radius: 152 },
  { symbol: 'F',  name: 'Fluorine',   atomicNumber: 9,  atomicMass: 18.998,  electronegativity: 3.98, group: 17, period: 2, category: 'halogen',              color: '#90E050', radius: 147 },
  { symbol: 'Ne', name: 'Neon',       atomicNumber: 10, atomicMass: 20.180,  electronegativity: 0,    group: 18, period: 2, category: 'noble gas',            color: '#B3E3F5', radius: 154 },
  { symbol: 'Na', name: 'Sodium',     atomicNumber: 11, atomicMass: 22.990,  electronegativity: 0.93, group: 1,  period: 3, category: 'alkali metal',         color: '#AB5CF2', radius: 227 },
  { symbol: 'Mg', name: 'Magnesium',  atomicNumber: 12, atomicMass: 24.305,  electronegativity: 1.31, group: 2,  period: 3, category: 'alkaline earth metal', color: '#8AFF00', radius: 173 },
  { symbol: 'Al', name: 'Aluminum',   atomicNumber: 13, atomicMass: 26.982,  electronegativity: 1.61, group: 13, period: 3, category: 'post-transition metal', color: '#BFA6A6', radius: 184 },
  { symbol: 'Si', name: 'Silicon',    atomicNumber: 14, atomicMass: 28.086,  electronegativity: 1.90, group: 14, period: 3, category: 'metalloid',            color: '#F0C8A0', radius: 210 },
  { symbol: 'P',  name: 'Phosphorus', atomicNumber: 15, atomicMass: 30.974,  electronegativity: 2.19, group: 15, period: 3, category: 'nonmetal',             color: '#FF8000', radius: 180 },
  { symbol: 'S',  name: 'Sulfur',     atomicNumber: 16, atomicMass: 32.065,  electronegativity: 2.58, group: 16, period: 3, category: 'nonmetal',             color: '#FFFF30', radius: 180 },
  { symbol: 'Cl', name: 'Chlorine',   atomicNumber: 17, atomicMass: 35.453,  electronegativity: 3.16, group: 17, period: 3, category: 'halogen',              color: '#1FF01F', radius: 175 },
  { symbol: 'Ar', name: 'Argon',      atomicNumber: 18, atomicMass: 39.948,  electronegativity: 0,    group: 18, period: 3, category: 'noble gas',            color: '#80D1E3', radius: 188 },
  { symbol: 'K',  name: 'Potassium',  atomicNumber: 19, atomicMass: 39.098,  electronegativity: 0.82, group: 1,  period: 4, category: 'alkali metal',         color: '#8F40D4', radius: 275 },
  { symbol: 'Ca', name: 'Calcium',    atomicNumber: 20, atomicMass: 40.078,  electronegativity: 1.00, group: 2,  period: 4, category: 'alkaline earth metal', color: '#3DFF00', radius: 231 },
  { symbol: 'Sc', name: 'Scandium',   atomicNumber: 21, atomicMass: 44.956,  electronegativity: 1.36, group: 3,  period: 4, category: 'transition metal',    color: '#E6E6E6', radius: 211 },
  { symbol: 'Ti', name: 'Titanium',   atomicNumber: 22, atomicMass: 47.867,  electronegativity: 1.54, group: 4,  period: 4, category: 'transition metal',    color: '#BFC2C7', radius: 187 },
  { symbol: 'V',  name: 'Vanadium',   atomicNumber: 23, atomicMass: 50.942,  electronegativity: 1.63, group: 5,  period: 4, category: 'transition metal',    color: '#A6A6AB', radius: 179 },
  { symbol: 'Cr', name: 'Chromium',   atomicNumber: 24, atomicMass: 51.996,  electronegativity: 1.66, group: 6,  period: 4, category: 'transition metal',    color: '#8A99C7', radius: 189 },
  { symbol: 'Mn', name: 'Manganese',  atomicNumber: 25, atomicMass: 54.938,  electronegativity: 1.55, group: 7,  period: 4, category: 'transition metal',    color: '#9C7AC7', radius: 197 },
  { symbol: 'Fe', name: 'Iron',       atomicNumber: 26, atomicMass: 55.845,  electronegativity: 1.83, group: 8,  period: 4, category: 'transition metal',    color: '#E06633', radius: 194 },
  { symbol: 'Co', name: 'Cobalt',     atomicNumber: 27, atomicMass: 58.933,  electronegativity: 1.88, group: 9,  period: 4, category: 'transition metal',    color: '#F090A0', radius: 192 },
  { symbol: 'Ni', name: 'Nickel',     atomicNumber: 28, atomicMass: 58.693,  electronegativity: 1.91, group: 10, period: 4, category: 'transition metal',    color: '#50D050', radius: 163 },
  { symbol: 'Cu', name: 'Copper',     atomicNumber: 29, atomicMass: 63.546,  electronegativity: 1.90, group: 11, period: 4, category: 'transition metal',    color: '#C88033', radius: 140 },
  { symbol: 'Zn', name: 'Zinc',       atomicNumber: 30, atomicMass: 65.380,  electronegativity: 1.65, group: 12, period: 4, category: 'transition metal',    color: '#7D80B0', radius: 139 },
  { symbol: 'Ga', name: 'Gallium',    atomicNumber: 31, atomicMass: 69.723,  electronegativity: 1.81, group: 13, period: 4, category: 'post-transition metal', color: '#C28F8F', radius: 187 },
  { symbol: 'Ge', name: 'Germanium',  atomicNumber: 32, atomicMass: 72.630,  electronegativity: 2.01, group: 14, period: 4, category: 'metalloid',            color: '#668F8F', radius: 211 },
  { symbol: 'As', name: 'Arsenic',    atomicNumber: 33, atomicMass: 74.922,  electronegativity: 2.18, group: 15, period: 4, category: 'metalloid',            color: '#BD80E3', radius: 185 },
  { symbol: 'Se', name: 'Selenium',   atomicNumber: 34, atomicMass: 78.960,  electronegativity: 2.55, group: 16, period: 4, category: 'nonmetal',             color: '#FFA100', radius: 190 },
  { symbol: 'Br', name: 'Bromine',    atomicNumber: 35, atomicMass: 79.904,  electronegativity: 2.96, group: 17, period: 4, category: 'halogen',              color: '#A62929', radius: 185 },
  { symbol: 'Kr', name: 'Krypton',    atomicNumber: 36, atomicMass: 83.798,  electronegativity: 3.00, group: 18, period: 4, category: 'noble gas',            color: '#5CB8D1', radius: 202 },
];

export const periodicTableMap = new Map<string, Atom>(
  elements.map((el) => [el.symbol, el])
);

export const periodicTableArray: Atom[] = elements;

export function getElement(symbol: string): Atom | undefined {
  return periodicTableMap.get(symbol);
}
