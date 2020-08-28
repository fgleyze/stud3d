import React, { useRef, useState, useMemo } from 'react'
import './App.css';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";
import { BoxBufferGeometry } from 'three';

extend({ OrbitControls });

const femaleStraigthJunction = 0;
const maleStraigthJunction = 1;
const femaleCornerJunction = 2;

function Controls(props) {
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

class Canvas3d extends React.Component {  
  render() {
    const length = this.props.length;
    const height = this.props.height;

    const wallDimensions = [length, height, 145];

    const doubleTopPlate = {
      length: length - 2 * 145,
      xPosition: 145,
    }

    if (this.props.leftJunction == maleStraigthJunction && this.props.rightJunction == maleStraigthJunction) {
      doubleTopPlate.length = length + 2 * 145;
      doubleTopPlate.xPosition = -145;
    } else if (this.props.leftJunction == maleStraigthJunction) {
      doubleTopPlate.length = length;
      doubleTopPlate.xPosition = -145;
    } else if (this.props.rightJunction == maleStraigthJunction) {
      doubleTopPlate.length = length;
      doubleTopPlate.xPosition = 145;
    }

    let studs = [
      // bottom plate
      {
        dimensions: [length, 45, 145],
        positions: [0, 0, 0],
      },
      // top plate
      {
        dimensions: [length, 45, 145],
        positions: [0, height - (2 * 45), 0],
      },
      // double top plate
      {
        dimensions: [doubleTopPlate.length, 45, 145],
        positions: [doubleTopPlate.xPosition, height - 45, 0],
      },
      // last common stud
      {
        dimensions: [45, height - (3 * 45), 145],
        positions: [length - 45, 45, 0],
      },
    ];
    
    // common studs
    for ( let offset = 0; offset < (this.props.rightJunction == femaleCornerJunction ? length - (145 + 45 * 2) : length); offset += 645 ) {
      studs.push({
        dimensions: [45, height - (3 * 45), 145],
        positions: [offset, 45, 0]
      })
    }

    // left corner female junction stud
    if (this.props.leftJunction == femaleCornerJunction) {
      studs.push({
        dimensions: [145, height - (3 * 45), 45],
        positions: [45, 45, 100]
      });
    }

    // right corner female junction stud
    if (this.props.rightJunction == femaleCornerJunction) {
      studs.push({
        dimensions: [145, height - (3 * 45), 45],
        positions: [length - (45 + 145), 45, 100]
      });
    }

    let renderedStuds = [];

    for (let stud of studs) {
      renderedStuds.push(<Stud dimensions={stud.dimensions} positions={stud.positions}/>)
    }

    return <Canvas camera={{ position: [-12, 0, 30] }}>
      <Controls />
      <axesHelper/>
      <pointLight position={[150, 140, 100]} />
      <pointLight position={[-150, -140, -100]} />
      <group position={wallDimensions.map(coor => -Math.abs(coor / 100 / 2))}>
        //studs
        {renderedStuds}
      </group>
    </Canvas>
  }
}

class App extends React.Component {
  state = {
    length: 3500,
    height: 2500,
    leftJunction: femaleStraigthJunction,
    rightJunction: femaleStraigthJunction,
    studs: [],
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

  createStuds() {

  }

  render() {
    return (
      <div className="flex">
        <div className="relative flex-none border-r border-solid border-gray-300">
          <div className="px-4">
            <p className="py-4 text-center text-xl">Stud 3D</p>

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
              <option value={femaleStraigthJunction}>tout droit - femelle</option>
              <option value={maleStraigthJunction}>angle/tout droit - mâle</option>
              <option value={femaleCornerJunction}>angle - femme</option>
            </select>

            <label className="block mb-1">Liaison droite :</label>
            <select
              value={this.state.rightJunction}
              onChange={this.handleRightJunctionChange}
              className="block w-full mb-4 border rounded py-2 px-3"
            >
              <option value={femaleStraigthJunction}>tout droit - femelle</option>
              <option value={maleStraigthJunction}>angle/tout droit - mâle</option>
              <option value={femaleCornerJunction}>angle - femme</option>
            </select>
          </div>
          <a href="https://github.com/fgleyze/stud3d" target="_blank" className="w-full absolute bottom-0 pb-4">
            <img className="mx-auto h-8" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="></img>
          </a>
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
