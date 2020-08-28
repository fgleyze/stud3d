import React, { useRef, useMemo } from 'react'
import './App.css';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";
import * as THREE from 'three';

extend({ OrbitControls });

function Controls(props) {
  const controls = useRef()
  const { camera, gl } = useThree()
  useFrame(() => controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} />
}

function Stud(props) {
  const mesh = useRef()

  let positions = [];
  const resetPositions = props.dimensions.map(coor => coor / 2)

  for (var i = 0; i < props.dimensions.map(coor => coor / 2).length; i++) {
    positions.push(props.positions[i] + resetPositions[i])
  }

  const scaledDimensions = props.dimensions.map(coor => coor / 100);

  // https://github.com/react-spring/react-three-fiber/issues/250
  const geom = useMemo(() => new THREE.BoxBufferGeometry(
    scaledDimensions[0], 
    scaledDimensions[1], 
    scaledDimensions[2])
  )

  return (
    <group position={positions.map(coor => coor / 100)}>
      <lineSegments ref={mesh}>
        <edgesGeometry attach="geometry" args={[geom]} />
        <lineBasicMaterial color="black" attach="material" />
      </lineSegments>
      <mesh ref={mesh}>
        <boxBufferGeometry attach="geometry" args={props.dimensions.map(coor => coor / 100)} />
        <meshStandardMaterial attach="material" color='orange' />
      </mesh>
    </group>
  )
}

function Canvas3d(props) {
  const wallDimensions = [4000, 2500, 145];
  
  return <Canvas camera={{ position: [0, 0, 100] }}>
    <Controls />
    <axesHelper/>
    <pointLight position={[150, 140, 100]} />
    <pointLight position={[-150, -140, -100]} />
    <group position={wallDimensions.map(coor => -Math.abs(coor / 200))}>
      <Stud dimensions={[4000, 45, 145]} positions={[0, 0, 0]}/>
      <Stud dimensions={[4000, 45, 145]} positions={[0, 2500, 0]}/>
      <Stud dimensions={[45, 2500, 145]} positions={[0, 0, 0]}/>
      <Stud dimensions={[45, 2500, 145]} positions={[4000, 0, 0]}/>
    </group>
  </Canvas>
}

function App() {
  return (
    <div className="flex">
      <div className="flex-none">
        Stud3D
      </div>
      <div className="flex-1 h-screen">
        <Canvas3d/>
      </div>
    </div>
  );
}

export default App;
