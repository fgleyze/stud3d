import React, { useRef } from 'react'
import './App.css';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";

extend({ OrbitControls });

function Controls(props) {
  const controls = useRef()
  const { camera, gl } = useThree()
  useFrame(() => controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} />
}

function Stud(props) {
  const mesh = useRef()

  let dimensions = props.dimensions.map(x => x / 100)
  let position = dimensions.map(x => x / 2)

  return (
    <mesh position={position} ref={mesh}>
      <boxBufferGeometry attach="geometry" args={dimensions} />
      <meshStandardMaterial attach="material" color='orange' />
    </mesh>
  )
}

function App() {
  return (
    <div class="flex">
      <div class="flex-none">
        Stud3D
      </div>
      <div className="flex-1 h-screen">
        <Canvas camera={{ position: [-100, 0, 0] }}>
          <Controls />
          <axesHelper/>
          <pointLight position={[150, 140, 100]} />
          <pointLight position={[-150, -140, -100]} />
          <Stud dimensions={[145, 45, 4000]} />
          <Stud dimensions={[145, 2500, 45]} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
