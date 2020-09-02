import React, { useRef, useState, useMemo } from 'react'
import './App.css';
import { extend, Canvas, useFrame, useThree, createPortal } from 'react-three-fiber';
import { OrbitControls } from "three-orbitcontrols";
import { BoxBufferGeometry } from 'three';

extend({ OrbitControls });

const junctions = {
  femaleStraigth: 0,
  maleStraigth: 1,
  femaleCorner: 2,
}

const studTypes = {
  commonStud: "commonStud",
  other: "other",
}

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

function Canvas3d(props) {  
    const wallDimensions = [props.length, props.height, 145];

    let renderedStuds = [];

    for (let stud of props.studs) {
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

function WallForm(props) {
  function renderSelect(name, value, handleWallChange) {
    return   <select
      name={name}
      value={value}
      onChange={handleWallChange}
      className="block w-full mb-4 border rounded py-2 px-3"
    >
      <option value={junctions.femaleStraigth}>tout droit - femelle</option>
      <option value={junctions.maleStraigth}>angle/tout droit - mâle</option>
      <option value={junctions.femaleCorner}>angle - femme</option>
    </select>
  }

  return <div>
    <h1 className="text-lg mb-2">Mur</h1>

    <label className="block mb-1">Longueur en mm :</label>
    <input
      className="block w-full mb-4 border rounded py-2 px-3"
      type="number"
      name="length"
      value={props.wall.length}
      onChange={props.handleWallChange}
    />

    <label className="block mb-1">Hauteur en mm :</label>
    <input
      className="block w-full mb-4 border rounded py-2 px-3"
      type="number"
      name="height"
      value={props.wall.height}
      onChange={props.handleWallChange}
    />

    <label className="block mb-1">Liaison gauche :</label>
    {renderSelect("leftJunction", props.wall.leftJunction, props.handleWallChange)}

    <label className="block mb-1">Liaison droite :</label>
    {renderSelect("rightJunction", props.wall.rightJunction, props.handleWallChange)}
  </div>
}

function OpeningForm(props) {
  return <div>
    <h1 className="text-lg mb-2">Ouverture</h1>

    <label className="block mb-1">Largeur en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="length"
      value={props.opening.length}
      onChange={props.handleOpeningChange}
    />

    <label className="block mb-1">Hauteur en mm :</label>
    <input
      className="block w-full mb-4 border rounded py-2 px-3"
      type="number"
      name="height"
      value={props.opening.height}
      onChange={props.handleOpeningChange}
    />

    <label className="block mb-1">Décalage en mm :</label>
    <input
      className="block w-full mb-4 border rounded py-2 px-3"
      type="number"
      name="leftDistance"
      value={props.opening.leftDistance}
      onChange={props.handleOpeningChange}
    />

    <label className="block mb-1">Hauteur d'allège en mm :</label>
    <input
      className="block w-full mb-4 border rounded py-2 px-3"
      type="number"
      name="sill"
      value={props.opening.sill}
      onChange={props.handleOpeningChange}
    />
  </div>
}

function StudSections(props) {
  let sections = [];

  for (let stud of props.studs) {
    sections.push(<p>{stud.dimensions[0]} x {stud.dimensions[1]} x {stud.dimensions[2]}</p>)
  }

  return <div>
    {sections}
  </div>;
}

class App extends React.Component {
  state = {
    wall: {
      length: 3500,
      height: 2500,
      leftJunction: junctions.femaleStraigth,
      rightJunction: junctions.femaleStraigth,
    },
    opening: {
      leftDistance: 680,
      length: 800,
      height: 950,
      sill: 500,
    },
    studs: [],
  };

  componentDidMount() {
    let studs = this.calculateOpeningStuds(
      this.calculateWallStuds(this.state.wall), 
      this.state.opening, 
      this.state.wall
    );

    this.setState({ 
      studs,
    });
 }

  handleWallChange = event => {
    const wall = Object.assign({}, this.state.wall);
    wall[event.target.name] = parseInt(event.target.value);

    let studs = this.calculateOpeningStuds(
      this.calculateWallStuds(wall), 
      this.state.opening, 
      wall
    );

    this.setState({ 
      wall,
      studs
    });
  };

  handleOpeningChange = event => {
    const opening = Object.assign({}, this.state.opening);
    opening[event.target.name] = parseInt(event.target.value);

    let studs = this.calculateOpeningStuds(
      this.calculateWallStuds(this.state.wall), 
      opening, 
      this.state.wall
    );

    this.setState({ 
      opening,
      studs
    });
  };

  calculateWallStuds(wall) {
    const length = wall.length ;
    const height = wall.height ;
    const leftJunction = wall.leftJunction ;
    const rightJunction = wall.rightJunction ;

    const doubleTopPlate = {
      length: length - 2 * 145,
      positionX: 145,
    }

    // calculate double top plate length
    if (leftJunction == junctions.maleStraigth && rightJunction == junctions.maleStraigth) {
      doubleTopPlate.length = length + 2 * 145;
      doubleTopPlate.positionX = -145;
    } else if (leftJunction == junctions.maleStraigth) {
      doubleTopPlate.length = length;
      doubleTopPlate.positionX = -145;
    } else if (rightJunction == junctions.maleStraigth) {
      doubleTopPlate.length = length;
      doubleTopPlate.positionX = 145;
    }

    let studs = [
      // bottom plate
      {
        dimensions: [length, 45, 145],
        positions: [0, 0, 0],
        type: studTypes.other,
      },
      // top plate
      {
        dimensions: [length, 45, 145],
        positions: [0, height - (2 * 45), 0],
        type: studTypes.other,
      },
      // double top plate
      {
        dimensions: [doubleTopPlate.length, 45, 145],
        positions: [doubleTopPlate.positionX, height - 45, 0],
        type: studTypes.other,
      },
      // last common stud
      {
        dimensions: [45, height - (3 * 45), 145],
        positions: [length - 45, 45, 0],
        type: studTypes.other,
      },
    ];
    
    // common studs
    for ( let offset = 0; offset < (rightJunction == junctions.femaleCorner ? length - (145 + 45 * 2) : length); offset += 645 ) {
      studs.push({
        dimensions: [45, height - (3 * 45), 145],
        positions: [offset, 45, 0],
        type: studTypes.commonStud,
      })
    }

    // left corner female junction stud
    if (leftJunction == junctions.femaleCorner) {
      studs.push({
        dimensions: [145, height - (3 * 45), 45],
        positions: [45, 45, 100],
        type: studTypes.other,
      });
    }

    // right corner female junction stud
    if (rightJunction == junctions.femaleCorner) {
      studs.push({
        dimensions: [145, height - (3 * 45), 45],
        positions: [length - (45 + 145), 45, 100],
        type: studTypes.other,
      });
    }

    return studs;
  }

  calculateOpeningStuds(studs, opening, wall) {
    const wallHeight = wall.height ;
    const leftDistance = opening.leftDistance;
    const length = opening.length;
    const height = opening.height;
    const sill = opening.sill;

    studs.push(...[
      // left king stud
      {
        dimensions: [45, wallHeight - (3 * 45), 145],
        positions: [leftDistance - (45 * 2), 45, 0],
        type: studTypes.other,
      },
      // right king stud
      {
        dimensions: [45, wallHeight - (3 * 45), 145],
        positions: [leftDistance + length + 45, 45, 0],
        type: studTypes.other,
      },
      // header 1
      {
        dimensions: [length + (45 * 2), 145, 45],
        positions: [leftDistance - 45, sill + height, 0],
        type: studTypes.other,
      },
      // header 2
      {
        dimensions: [length + (45 * 2), 145, 45],
        positions: [leftDistance - 45, sill + height, 45],
        type: studTypes.other,
      },
      // header 3
      {
        dimensions: [length + (45 * 2), 145, 45],
        positions: [leftDistance - 45, sill + height, 45 * 2],
        type: studTypes.other,
      },
      // left trimmer stud
      {
        dimensions: [45, height, 145],
        positions: [leftDistance - 45, sill, 0],
        type: studTypes.other,
      },
      // left top trimmer stud
      {
        dimensions: [45, wallHeight - (sill + height + (2 * 45) + 145), 145],
        positions: [leftDistance - 45, sill + height + 145, 0],
        type: studTypes.other,
      },
      // right trimmer stud
      {
        dimensions: [45, height, 145],
        positions: [leftDistance + length, sill, 0],
        type: studTypes.other,
      },
      // right top trimmer stud
      {
        dimensions: [45, wallHeight - (sill + height + (2 * 45) + 145), 145],
        positions: [leftDistance + length, sill + height + 145, 0],
        type: studTypes.other,
      },
    ]);

    // sill
    if (sill > 45 && sill < (2 * 45)) {
      studs.push({
        dimensions: [length + (45 * 2), sill, 145],
        positions: [leftDistance - 45, sill - 45, 0],
        type: studTypes.other,
      })
    } else if (sill > (2 * 45)) {
      studs.push({
        dimensions: [length + (45 * 2), 45, 145],
        positions: [leftDistance - 45, sill - 45, 0],
        type: studTypes.other,
      })
    }

    if (sill > 45) {
      // left lower trimmer stud
      studs.push(...[{
        dimensions: [45, sill - (2 * 45), 145],
        positions: [leftDistance - 45, 45, 0],
        type: studTypes.other,
      },
      // right lower trimmer stud
      {
        dimensions: [45, sill - (2 * 45), 145],
        positions: [leftDistance + length, 45, 0],
        type: studTypes.other,
      }])
    }

    // remove or replace overlapping commn studs
    // https://stackoverflow.com/questions/24812930/how-to-remove-element-from-array-in-foreach-loop
    studs.reduceRight(function (acc, stud, key, object) {
      if (stud.type === studTypes.commonStud && stud.positions[0] > leftDistance - (3 * 45) && stud.positions[0] < leftDistance
      || stud.type === studTypes.commonStud && stud.positions[0] > (leftDistance + length) - (45) && stud.positions[0] < (leftDistance + length) + (2 * 45)) {
        object.splice(key, 1);
      } else if (stud.type === studTypes.commonStud && stud.positions[0] >= leftDistance - (2 * 45) && stud.positions[0] <= (leftDistance + length + 45)) {
        //top jack studs
        let topJackStud = JSON.parse(JSON.stringify(object[key]));
        topJackStud.dimensions[1] = wallHeight - (sill + height + 145 + (2 * 45));
        topJackStud.positions[1] = sill + height + 145;
        object.push(topJackStud);

        if (sill <= 45) {
          object.splice(key, 1);
        } else {
          //bottom jack studs
          let bottomJackStud = JSON.parse(JSON.stringify(object[key]));
          bottomJackStud.dimensions[1] = sill - (2 * 45);
          object[key] = bottomJackStud;
        }
      }
    });
    return studs;
  }

  render() {
    return (
      <div className="flex">
        <div className="relative flex-none border-r border-solid border-gray-300">
          <div className="px-4">
            <p className="py-4 text-center text-xl">Stud 3D</p>
            <WallForm 
              wall={this.state.wall}
              handleWallChange={this.handleWallChange}
            />
            <OpeningForm 
              opening={this.state.opening}
              handleOpeningChange={this.handleOpeningChange}
            />
          </div>
          <a href="https://github.com/fgleyze/stud3d" target="_blank" className="w-full absolute bottom-0 pb-4">
            <img className="mx-auto h-8" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="></img>
          </a>
        </div>
        <div className="flex-1 h-screen">
          <Canvas3d
            height={this.state.wall.height}
            length={this.state.wall.length}
            studs={this.state.studs}
          />
        </div>
        <div className="relative flex-none border-l border-solid border-gray-300">
          <div className="px-4">
            <p className="py-4 text-center text-xl">Sections</p>
              <StudSections studs={this.state.studs} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
