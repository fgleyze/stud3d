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
      <lineSegments>
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

function CommonStud(props) {
  return (
    <Stud dimensions={[45, props.height - (3 * 45), 145]} positions={[props.offset, 45, 0]}/>
  );
}

class Canvas3d extends React.Component {
  renderCommonStud(offset, height) {
    return (
      <CommonStud key={offset} offset={offset} height={height} />
    );
  }
  
  render() {
    const length = 4000;
    const height = 2500;

    const wallDimensions = [length, height, 145];

    let commonStuds = []

    for ( let offset = 0; offset < length; offset += 645 ) {
      commonStuds.push(this.renderCommonStud(offset, height))
    }

    return <Canvas camera={{ position: [-12, 0, 30] }}>
      <Controls />
      <axesHelper/>
      <pointLight position={[150, 140, 100]} />
      <pointLight position={[-150, -140, -100]} />
      <group position={wallDimensions.map(coor => -Math.abs(coor / 100 / 2))}>
        // bottom plate
        <Stud dimensions={[length, 45, 145]} positions={[0, 0, 0]}/>
        // top plate
        <Stud dimensions={[length, 45, 145]} positions={[0, height - (2 * 45), 0]}/>
        // double top plate
        <Stud dimensions={[length - 2 * 145, 45, 145]} positions={[145, height - 45, 0]}/>

        // common studs
        {commonStuds}

        // last stud
        <Stud dimensions={[45, height - (3 * 45), 145]} positions={[length - 45, 45, 0]}/>
      </group>
    </Canvas>
  }
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
