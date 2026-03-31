import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { MoleculeGeometry, AtomPosition, BondGeometry } from '../types';
import * as THREE from 'three';

interface MoleculeViewerProps {
  geometry: MoleculeGeometry | null;
}

function AtomSphere({ atom }: { atom: AtomPosition }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.15 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={atom.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[atom.radius * 0.3, 32, 32]} />
      <meshStandardMaterial
        color={atom.color}
        roughness={0.3}
        metalness={0.2}
      />
      {hovered && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div className="atom-label">{atom.symbol}</div>
        </Html>
      )}
    </mesh>
  );
}

function BondCylinder({ bond }: { bond: BondGeometry }) {
  const cylinders = useMemo(() => {
    const start = new THREE.Vector3(...bond.start);
    const end = new THREE.Vector3(...bond.end);
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const orientation = new THREE.Matrix4();
    orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0));
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation);
    // Rotate 90 degrees on X axis so cylinder aligns along the bond
    quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));

    const result: { position: THREE.Vector3; quaternion: THREE.Quaternion; length: number }[] = [];

    if (bond.order === 1) {
      result.push({ position: midpoint, quaternion, length });
    } else {
      // Compute offset perpendicular to the bond direction
      const up = new THREE.Vector3(0, 1, 0);
      let perp = new THREE.Vector3().crossVectors(direction.normalize(), up);
      if (perp.length() < 0.01) {
        perp = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(1, 0, 0));
      }
      perp.normalize();

      const spacing = 0.08;
      for (let i = 0; i < bond.order; i++) {
        const offset = (i - (bond.order - 1) / 2) * spacing;
        const pos = midpoint.clone().add(perp.clone().multiplyScalar(offset));
        result.push({ position: pos, quaternion: quaternion.clone(), length });
      }
    }

    return result;
  }, [bond]);

  const radius = bond.order === 1 ? 0.06 : 0.04;

  return (
    <>
      {cylinders.map((cyl, i) => (
        <mesh key={i} position={cyl.position} quaternion={cyl.quaternion}>
          <cylinderGeometry args={[radius, radius, cyl.length, 8]} />
          <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </>
  );
}

function MoleculeScene({ geometry }: { geometry: MoleculeGeometry }) {
  return (
    <>
      {geometry.atoms.map((atom, i) => (
        <AtomSphere key={`atom-${i}`} atom={atom} />
      ))}
      {geometry.bonds.map((bond, i) => (
        <BondCylinder key={`bond-${i}`} bond={bond} />
      ))}
    </>
  );
}

export default function MoleculeViewer({ geometry }: MoleculeViewerProps) {
  if (!geometry || (geometry.atoms.length === 0 && geometry.bonds.length === 0)) {
    return (
      <div className="molecule-viewer-empty">
        <div className="molecule-viewer-placeholder">
          <span className="molecule-icon">⚛️</span>
          <p>Select a formula to view its 3D structure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="molecule-viewer">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        <MoleculeScene geometry={geometry} />
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
    </div>
  );
}
