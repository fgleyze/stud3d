import React, { useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Stud({ dimensions, positions }) {
  const mesh = useRef()
  const [hovered, setHover] = useState(false)

  const scaledDimensions = useMemo(() => 
    dimensions.map(coor => coor / 100), 
    [dimensions[0], dimensions[1], dimensions[2]]
  );

  const calculatedPositions = useMemo(() => {
    const resetPositions = dimensions.map(coor => coor / 2);
    return positions.map((pos, i) => (pos + resetPositions[i]) / 100);
  }, [dimensions[0], dimensions[1], dimensions[2], positions[0], positions[1], positions[2]]);

  const geom = useMemo(() => new THREE.BoxGeometry(
    scaledDimensions[0], 
    scaledDimensions[1], 
    scaledDimensions[2]
  ), [scaledDimensions]);

  return (
    <group position={calculatedPositions}>
      <lineSegments>
        <edgesGeometry args={[geom]} />
        <lineBasicMaterial color="black" />
      </lineSegments>
      <mesh
        ref={mesh}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <boxGeometry args={scaledDimensions} />
        <meshStandardMaterial color={hovered ? 'red' : 'orange'} />
      </mesh>
    </group>
  )
}

function Canvas3d(props) {  
  const wallDimensions = [props.length, props.height, 145];

  return (
    <Canvas camera={{ position: [-12, 0, window.innerWidth > 800 ? 30 : 70] }}>
      <OrbitControls />
      <ambientLight intensity={0.6} />
      <pointLight position={[150, 140, 100]} intensity={1} />
      <pointLight position={[-150, -140, -100]} intensity={0.5} />
      <group position={wallDimensions.map(coor => -Math.abs(coor / 100 / 2))}>
        {props.studs.map((stud, index) => (
          <Stud 
            key={`${index}-${stud.dimensions.join('-')}-${stud.positions.join('-')}`} 
            dimensions={stud.dimensions} 
            positions={stud.positions}
          />
        ))}
      </group>
    </Canvas>
  )
}

export default Canvas3d;
