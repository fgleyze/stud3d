import React, { useRef, useMemo } from 'react'
import './App.css';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";
import * as THREE from 'three';

extend({ OrbitControls });

const femaleStraigthJunction = 0;
const maleStraigthJunction = 1;
const maleCornerJunction = 2;

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
    const length = this.props.length;
    const height = this.props.height;

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

        // last common stud
        <Stud dimensions={[45, height - (3 * 45), 145]} positions={[length - 45, 45, 0]}/>

        //left male corner junction
        {this.props.leftJunction == maleCornerJunction && <Stud dimensions={[145, height - (3 * 45), 45]} positions={[45, 45, 100]}/>}

        //right male corner junction
        {this.props.rightJunction == maleCornerJunction && <Stud dimensions={[145, height - (3 * 45), 45]} positions={[length - (45 + 145), 45, 100]}/>}
      </group>
    </Canvas>
  }
}

class App extends React.Component {
  state = {
    length: 3000,
    height: 2500,
    leftJunction: maleCornerJunction,
    rightJunction: femaleStraigthJunction,
  };

  handleLengthChange = event => {
    this.setState({ length: event.target.value });
  };

  handleHeightChange = event => {
    this.setState({ height: event.target.value });
  };

  handleLeftJunctionChange = event => {
    this.setState({ leftJunction: event.target.value });
  };

  handleRightJunctionChange = event => {
    this.setState({ rightJunction: event.target.value });
  };

  render() {
    return (
      <div className="flex">
        <div className="flex-none px-4">
          <p className="py-4 text-center">Stud 3D</p>

          <label className="block mb-1">Longueur en mm :</label>
          <input
            className="block w-full mb-4 border rounded py-2 px-3"
            type="number"
            value={this.state.length}
            onChange={this.handleLengthChange}
          />

          <label className="block mb-1">Hauteur en mm :</label>
          <input
            className="block w-full mb-4 border rounded py-2 px-3"
            type="number"
            value={this.state.height}
            onChange={this.handleHeightChange}
          />

          <label className="block mb-1">Liaison gauche :</label>
          <select
            value={this.state.leftJunction}
            onChange={this.handleLeftJunctionChange}
            className="block w-full mb-4 border rounded py-2 px-3"
          >
            <option value={femaleStraigthJunction}>droite femme</option>
            <option value={maleStraigthJunction}>droite mâle / angle femme</option>
            <option value={maleCornerJunction}>angle mâle</option>
          </select>

          <label className="block mb-1">Liaison droite :</label>
          <select
            value={this.state.rightJunction}
            onChange={this.handleRightJunctionChange}
            className="block w-full mb-4 border rounded py-2 px-3"
          >
            <option value={femaleStraigthJunction}>droite femme</option>
            <option value={maleStraigthJunction}>droite mâle / angle femme</option>
            <option value={maleCornerJunction}>angle mâle</option>
          </select>
        </div>
        <div className="flex-1 h-screen">
          <Canvas3d
            height={this.state.height}
            length={this.state.length}
            leftJunction={this.state.leftJunction}
            rightJunction={this.state.rightJunction}
          />
        </div>
      </div>
    );
  }
}

export default App;
