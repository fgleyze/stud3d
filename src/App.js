import React, { useRef, useState } from 'react'
import './App.css';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";

extend({ OrbitControls });

function Controls(props) {
  const controls = useRef()
  const { scene, camera, gl } = useThree()
  useFrame(() => controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} />
}

function Box(props) {
  const mesh = useRef()

  return (
    <mesh
      {...props}
      ref={mesh}
    >
      <boxBufferGeometry attach="geometry" args={[5, 3, 1]} />
      <meshStandardMaterial attach="material" color='orange' />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <Canvas camera={{ position: [5, 5, 10] }}>
        <Controls />
        <pointLight position={[10, 7, 5]} />
        <pointLight position={[-10, -7, -5]} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
