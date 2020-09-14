import React, { useRef, useState, useMemo } from 'react'
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";
import { BoxBufferGeometry } from 'three';

extend({ OrbitControls });

function Controls() {
    const controls = useRef()
    const { camera, gl } = useThree()
    useFrame(() => controls.current.update())
    return <orbitControls ref={controls} args={[camera, gl.domElement]} />
  }
  
  function Stud(props) {
    const mesh = useRef()
    const [hovered, setHover] = useState(false)
  
    let positions = [];
    const resetPositions = props.dimensions.map(coor => coor / 2)
  
    for (var i = 0; i < props.dimensions.map(coor => coor / 2).length; i++) {
      positions.push(props.positions[i] + resetPositions[i])
    }
  
    const scaledDimensions = props.dimensions.map(coor => coor / 100);
  
    // https://github.com/react-spring/react-three-fiber/issues/250
    const geom = useMemo(() => new BoxBufferGeometry(
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
        <mesh
          ref={mesh}
          onPointerOver={(e) => setHover(true)}
          onPointerOut={(e) => setHover(false)}
        >
          <boxBufferGeometry attach="geometry" args={props.dimensions.map(coor => coor / 100)} />
          <meshStandardMaterial attach="material" color={hovered ? 'red' : 'orange'} />
        </mesh>
      </group>
    )
  }
  
  function Canvas3d(props) {  
      const wallDimensions = [props.length, props.height, 145];
    console.log(window.innerWidth)
      let renderedStuds = [];
  
      for (let stud of props.studs) {
        renderedStuds.push(<Stud dimensions={stud.dimensions} positions={stud.positions}/>)
      }
  
      return <Canvas camera={{ position: [-12, 0, window.innerWidth > 800 ? 30 : 70] }}>
        <Controls />
        <pointLight position={[150, 140, 100]} />
        <pointLight position={[-150, -140, -100]} />
        <group position={wallDimensions.map(coor => -Math.abs(coor / 100 / 2))}>
          //studs
          {renderedStuds}
        </group>
      </Canvas>
  }
  
  export default Canvas3d;