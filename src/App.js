import React from 'react'
import Canvas3d from './Canvas3d.js';
import './App.css';
import './custom.css';
import { ReactComponent as DoorSVG } from './svg/door.svg';
import { ReactComponent as DoorSelectedSVG } from './svg/door_selected.svg';
import { ReactComponent as WindowSVG } from './svg/window.svg';
import { ReactComponent as WindowSelectedSVG } from './svg/window_selected.svg';

const junctions = {
  femaleStraigth: 0,
  maleStraigth: 1,
  femaleCorner: 2,
}

const studTypes = {
  commonStud: "commonStud",
  bottomPlate: "bottomPlate",
  other: "other",
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

  return <div className="mainMenu">
    <h1 className="text-lg font-bold mb-2">Mur</h1>

    <label className="block mb-1">Longueur en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="length"
      value={props.wall.length}
      onChange={props.handleWallChange}
      min={600}
      max={6000}
    />
    <input 
      className="block w-full my-2 mb-4"
      type="range"
      name="length"
      value={props.wall.length}
      onChange={props.handleWallChange}
      min={props.opening.leftDistance + props.opening.length + (3 * 45)}
      max={6000}
    />

    <label className="block mb-1">Hauteur en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="height"
      value={props.wall.height}
      onChange={props.handleWallChange}
      min={props.opening.sill + props.opening.height + 45 + 45 + 145}
      max={4000}
    />
    <input 
      className="block w-full my-2 mb-4"
      type="range"
      name="height"
      value={props.wall.height}
      onChange={props.handleWallChange}
      min={props.opening.sill + props.opening.height + 45 + 45 + 145}
      max={4000}
    />

    <label className="block mb-1">Liaison gauche :</label>
    {renderSelect("leftJunction", props.wall.leftJunction, props.handleWallChange)}

    <label className="block mb-1">Liaison droite :</label>
    {renderSelect("rightJunction", props.wall.rightJunction, props.handleWallChange)}
  </div>
}

function OpeningForm(props) {
  return <div>
    <h1 className="text-lg font-bold mb-2">Ouverture</h1>

    <label className="block mb-1">Largeur en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="length"
      value={props.opening.length}
      onChange={props.handleOpeningChange}
    />
    <input 
      className="block w-full my-2"
      type="range"
      name="length"
      value={props.opening.length}
      onChange={props.handleOpeningChange}
      min={45}
      max={props.wall.length - (props.opening.leftDistance + 3 * 45)}
    />

    <label className="block mb-1">Décalage en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="leftDistance"
      value={props.opening.leftDistance}
      onChange={props.handleOpeningChange}
    />
    <input 
      className="block w-full my-2"
      type="range"
      name="leftDistance"
      value={props.opening.leftDistance}
      onChange={props.handleOpeningChange}
      min={3 * 45}
      max={props.wall.length - (props.opening.length + 3 * 45)}
    />


    <label className="block mb-1">Hauteur en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="height"
      value={props.opening.height}
      onChange={props.handleOpeningChange}
    />
    <input 
      className="block w-full my-2"
      type="range"
      name="height"
      value={props.opening.height}
      onChange={props.handleOpeningChange}
      min={200}
      max={props.wall.height - (props.opening.sill + 45 + 45 + 145)}
    />

    {!props.opening.isDoor && <div>
      <label className="block mb-1">Hauteur d'allège en mm :</label>
      <input
        className="block w-full mb-1 border rounded py-2 px-3"
        type="number"
        name="sill"
        value={props.opening.sill}
        onChange={props.handleOpeningChange}
        min={45}
      />
      <input 
        className="block w-full my-2"
        type="range"
        name="sill"
        value={props.opening.sill}
        onChange={props.handleOpeningChange}
        min={45}
        max={props.wall.height - (props.opening.height + 45 + 45 + 145)}
      />
    </div>}
  </div>
}

function StudSections(props) {
  let sections = [];

  for (let stud of props.studs) {
    sections.push(<p>{stud.dimensions[0]} x {stud.dimensions[1]} x {stud.dimensions[2]}</p>)
  }

  return <div>
    <h1 className="text-lg font-bold mb-2">Sections</h1>
    {sections}
  </div>;
}

class App extends React.Component {
  defaultSill = 1000;

  defaultOpening = {
    isDoor: false,
    leftDistance: 680,
    length: 800,
    height: 950,
    sill: this.defaultSill,
  };

  state = {
    wall: {
      length: 3500,
      height: 2500,
      leftJunction: junctions.femaleStraigth,
      rightJunction: junctions.femaleStraigth,
      hasOpening: false,
    },
    opening: this.defaultOpening,
    wallStuds: [],
    openingStuds: [],
  };

  componentDidMount() {
    let wallStuds = calculateWallStuds(this.state.wall);

    let openingStuds = [];

    if (this.state.wall.hasOpening) {
      openingStuds = calculateOpeningStuds(this.state.opening, this.state.wall);
      wallStuds = adaptWallStudsToOpening(wallStuds, this.state.wall, this.state.opening);
    }

    this.setState({ 
      wallStuds,
      openingStuds,
    });
 }

   handleWallChange = event => {
    const wall = Object.assign({}, this.state.wall);
    wall[event.target.name] = parseInt(event.target.value);

    let wallStuds = calculateWallStuds(wall);

    let openingStuds = [];

    if (this.state.wall.hasOpening) {
      openingStuds = calculateOpeningStuds(this.state.opening, wall);
      wallStuds = adaptWallStudsToOpening(wallStuds.concat(openingStuds), wall, this.state.opening);
    }

    this.setState({ 
      wall,
      openingStuds,
      wallStuds
    });
  };

  handleOpeningChange = event => {
    const opening = Object.assign({}, this.state.opening);
    opening[event.target.name] = parseInt(event.target.value);

    let wallStuds = calculateWallStuds(this.state.wall);
    let openingStuds = calculateOpeningStuds(opening, this.state.wall);

    wallStuds = adaptWallStudsToOpening(wallStuds.concat(openingStuds), this.state.wall, opening);

    this.setState({ 
      opening,
      wallStuds,
      openingStuds
    });
  };

  handleDoorChange = isDoor => {
    const wall = Object.assign({}, this.state.wall);
    const opening = Object.assign({}, this.state.opening);
    wall.hasOpening = isDoor;
    opening.isDoor = isDoor;
    
    if (isDoor) {
      opening.height = this.state.wall.height - (2*45 + 145);
      opening.sill = 0;
      wall.hasOpening = true;
    } else {
      const globalHeight = this.state.wall.height - (2*45 + 145);
      opening.height = Math.round(globalHeight / 2 - 1);
      opening.sill = Math.round(globalHeight / 2);
      wall.hasOpening = false;
    }
    
    let wallStuds = calculateWallStuds(wall);

    let openingStuds = [];

    if (wall.hasOpening) {
      let openingStuds = calculateOpeningStuds(opening, wall);
      wallStuds = adaptWallStudsToOpening(wallStuds.concat(openingStuds), wall, opening);
    }

    this.setState({ 
      wall,
      opening,
      wallStuds,
      openingStuds
    });
  };

  handleWallOpening(hasOpening) {
    const wall = Object.assign({}, this.state.wall);
    const opening = Object.assign({}, this.state.opening);
    wall.hasOpening = hasOpening;
    opening.isDoor = false;

    let wallStuds = calculateWallStuds(wall);

    let openingStuds = [];

    if (wall.hasOpening) {
      let openingStuds = calculateOpeningStuds(this.defaultOpening, wall);
      wallStuds = adaptWallStudsToOpening(wallStuds.concat(openingStuds), wall, this.defaultOpening);
    }

    this.setState({ 
      wall,
      opening: this.defaultOpening,
      wallStuds,
      openingStuds
    });
  }

  render() {
    return (
      <div className="flex h-screen">
        <div className="scroll overflow-y-scroll relative flex-0 border-r border-solid border-gray-300">
          <div className="px-4">
            <p className="mainTitle py-4 text-center text-6xl">Stud 3D</p>
            <WallForm 
              wall={this.state.wall}
              opening={this.state.opening}
              handleWallChange={this.handleWallChange}
            />
            
            <label className="block">Ouverture :</label>
            <div className="flex">
              <div className="flex-1 m-2 p-4 hover:bg-orange-200 rounded-lg">
                {this.state.wall.hasOpening && this.state.opening.isDoor ? <button 
                  className="w-full focus:outline-none"
                  type="button"
                  onClick={() => {this.handleDoorChange(false)}}
                ><DoorSelectedSVG /></button> : <button
                  className="w-full focus:outline-none"
                  type="button"
                  onClick={() => {this.handleDoorChange(true)}}
                ><DoorSVG /></button>}
              </div>

              <div className="flex-1 m-2 p-4 hover:bg-orange-200 rounded-lg">
                {this.state.wall.hasOpening && !this.state.opening.isDoor ? <button 
                  className="w-full focus:outline-none"
                  type="button"
                  onClick={() => {this.handleWallOpening(false)}}
                ><WindowSelectedSVG /></button> : <button
                  className="w-full focus:outline-none"
                  type="button"
                  onClick={() => {this.handleWallOpening(true)}}
                ><WindowSVG /></button>}
              </div>
            </div>


            {this.state.wall.hasOpening && <OpeningForm 
              wall={this.state.wall}
              opening={this.state.opening}
              handleOpeningChange={this.handleOpeningChange}
              handleDoorChange={this.handleDoorChange}
            />}

            <StudSections studs={this.state.wallStuds.concat(this.state.openingStuds)} />
          </div>
        </div>
        <div className="flex-1">
          <Canvas3d
            height={this.state.wall.height}
            length={this.state.wall.length}
            studs={this.state.wallStuds.concat(this.state.openingStuds)}
          />
        </div>
        <a href="https://github.com/fgleyze/stud3d" target="_blank" className="absolute bottom-0 right-0 p-4">
          <img className="mx-auto h-8" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="></img>
        </a>
      </div>
    );
  }
}

function calculateWallStuds(wall) {
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
      type: studTypes.bottomPlate,
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
  for ( let offset = 0; offset < (rightJunction == junctions.femaleCorner ? length - (145 + 45 * 2) : length - (2 * 45)); offset += 645 ) {
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

function calculateOpeningStuds(opening, wall) {
  const wallHeight = wall.height ;
  const leftDistance = opening.leftDistance;
  const length = opening.length;
  const height = opening.height;
  const sill = opening.sill;

  let studs = [];

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
      dimensions: [45, !opening.isDoor ? height : height - 45, 145],
      positions: [leftDistance - 45, !opening.isDoor ? sill : sill + 45, 0],
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
      dimensions: [45, !opening.isDoor ? height : height - 45, 145],
      positions: [leftDistance + length, !opening.isDoor ? sill : sill + 45, 0],
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

  return studs;
}

function adaptWallStudsToOpening(studs, wall, opening) {
  const wallHeight = wall.height ;
  const leftDistance = opening.leftDistance;
  const length = opening.length;
  const height = opening.height;
  const sill = opening.sill;

  console.log(studs);

    // remove or replace overlapping common studs
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

  if (opening.isDoor) {
    studs.forEach(function(stud, key){
      if(stud.type === studTypes.bottomPlate) {
        let leftBottomPlate = JSON.parse(JSON.stringify(studs[key]));
        let rightBottomPlate = JSON.parse(JSON.stringify(studs[key]));
        leftBottomPlate.dimensions[0] = opening.leftDistance;
        studs[key] = leftBottomPlate;

        rightBottomPlate.dimensions[0] = wall.length - (opening.leftDistance + opening.length);
        rightBottomPlate.positions[0] = opening.leftDistance + opening.length;
        studs.push(rightBottomPlate);
      }
    })
  }

  return studs;
}

export default App;
