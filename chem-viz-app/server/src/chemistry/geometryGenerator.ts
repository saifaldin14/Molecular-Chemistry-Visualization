import type { ParsedMolecule, MoleculeGeometry, AtomPosition, BondGeometry } from '../types.js';
import { periodicTableMap } from './periodicTable.js';

const BOND_LENGTH = 1.5;

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function vec(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

function toTuple(v: Vec3): [number, number, number] {
  return [v.x, v.y, v.z];
}

/**
 * Generate positions for surrounding atoms using VSEPR-inspired geometry.
 */
function getGeometryPositions(count: number): Vec3[] {
  const positions: Vec3[] = [];

  switch (count) {
    case 1:
      // Single bond: along +x axis
      positions.push(vec(BOND_LENGTH, 0, 0));
      break;

    case 2:
      // Linear: 180° apart along x axis
      positions.push(vec(BOND_LENGTH, 0, 0));
      positions.push(vec(-BOND_LENGTH, 0, 0));
      break;

    case 3: {
      // Trigonal planar: 120° apart in xy plane
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        positions.push(vec(
          BOND_LENGTH * Math.cos(angle),
          BOND_LENGTH * Math.sin(angle),
          0
        ));
      }
      break;
    }

    case 4: {
      // Tetrahedral
      const tetraAngle = Math.acos(-1 / 3);
      positions.push(vec(0, 0, BOND_LENGTH));
      for (let i = 0; i < 3; i++) {
        const phi = (i * 2 * Math.PI) / 3;
        positions.push(vec(
          BOND_LENGTH * Math.sin(tetraAngle) * Math.cos(phi),
          BOND_LENGTH * Math.sin(tetraAngle) * Math.sin(phi),
          BOND_LENGTH * Math.cos(tetraAngle)
        ));
      }
      break;
    }

    case 5: {
      // Trigonal bipyramidal: 3 equatorial + 2 axial
      // Axial positions
      positions.push(vec(0, 0, BOND_LENGTH));
      positions.push(vec(0, 0, -BOND_LENGTH));
      // Equatorial positions (120° apart in xy plane)
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        positions.push(vec(
          BOND_LENGTH * Math.cos(angle),
          BOND_LENGTH * Math.sin(angle),
          0
        ));
      }
      break;
    }

    case 6: {
      // Octahedral: 4 equatorial + 2 axial
      positions.push(vec(0, 0, BOND_LENGTH));
      positions.push(vec(0, 0, -BOND_LENGTH));
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        positions.push(vec(
          BOND_LENGTH * Math.cos(angle),
          BOND_LENGTH * Math.sin(angle),
          0
        ));
      }
      break;
    }

    default: {
      // For more than 6: distribute evenly on a sphere using golden spiral
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < count; i++) {
        const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
        const phi = (2 * Math.PI * i) / goldenRatio;
        positions.push(vec(
          BOND_LENGTH * Math.sin(theta) * Math.cos(phi),
          BOND_LENGTH * Math.sin(theta) * Math.sin(phi),
          BOND_LENGTH * Math.cos(theta)
        ));
      }
      break;
    }
  }

  return positions;
}

/**
 * Generate 3D molecular geometry from a parsed molecule.
 */
export function generateGeometry(parsed: ParsedMolecule): MoleculeGeometry {
  const atomPositions: AtomPosition[] = [];
  const bondGeometries: BondGeometry[] = [];

  // Expand atoms into individual entries
  const expandedAtoms: string[] = [];
  for (const { symbol, count } of parsed.atoms) {
    for (let i = 0; i < count; i++) {
      expandedAtoms.push(symbol);
    }
  }

  if (expandedAtoms.length === 0) {
    return { atoms: [], bonds: [] };
  }

  // Single atom case
  if (expandedAtoms.length === 1) {
    const el = periodicTableMap.get(expandedAtoms[0]);
    atomPositions.push({
      symbol: expandedAtoms[0],
      position: [0, 0, 0],
      color: el?.color ?? '#CCCCCC',
      radius: (el?.radius ?? 150) / 200,
    });
    return { atoms: atomPositions, bonds: [] };
  }

  // Find central atom (least electronegative non-hydrogen)
  let centralIndex = 0;
  let minEN = Infinity;
  for (let i = 0; i < expandedAtoms.length; i++) {
    const el = periodicTableMap.get(expandedAtoms[i]);
    if (el && el.symbol !== 'H' && el.electronegativity > 0 && el.electronegativity < minEN) {
      minEN = el.electronegativity;
      centralIndex = i;
    }
  }

  // Place central atom at origin
  const centralEl = periodicTableMap.get(expandedAtoms[centralIndex]);
  atomPositions.push({
    symbol: expandedAtoms[centralIndex],
    position: [0, 0, 0],
    color: centralEl?.color ?? '#CCCCCC',
    radius: (centralEl?.radius ?? 150) / 200,
  });

  // Get surrounding atoms (all except central)
  const surroundingIndices: number[] = [];
  for (let i = 0; i < expandedAtoms.length; i++) {
    if (i !== centralIndex) {
      surroundingIndices.push(i);
    }
  }

  // Generate positions for surrounding atoms
  const positions = getGeometryPositions(surroundingIndices.length);

  for (let i = 0; i < surroundingIndices.length; i++) {
    const origIdx = surroundingIndices[i];
    const el = periodicTableMap.get(expandedAtoms[origIdx]);
    const pos = positions[i];

    atomPositions.push({
      symbol: expandedAtoms[origIdx],
      position: toTuple(pos),
      color: el?.color ?? '#CCCCCC',
      radius: (el?.radius ?? 150) / 200,
    });

    // Create bond from central atom (index 0 in output) to this atom
    const bondOrder = parsed.bonds.find(
      (b) =>
        (b.atom1Index === centralIndex && b.atom2Index === origIdx) ||
        (b.atom1Index === origIdx && b.atom2Index === centralIndex)
    )?.order ?? 1;

    bondGeometries.push({
      start: [0, 0, 0],
      end: toTuple(pos),
      order: bondOrder,
    });
  }

  return { atoms: atomPositions, bonds: bondGeometries };
}
