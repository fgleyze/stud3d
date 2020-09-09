import React from 'react'
import Canvas3d from './Canvas3d.js';
import './App.css';
import './custom.css';
import {studSection, junctions, calculateWallStuds, calculateOpeningStuds, adaptWallStudsToOpening} from "./studsCalculator.js";
import { ReactComponent as DoorSVG } from './svg/door.svg';
import { ReactComponent as DoorSelectedSVG } from './svg/door_selected.svg';
import { ReactComponent as WindowSVG } from './svg/window.svg';
import { ReactComponent as WindowSelectedSVG } from './svg/window_selected.svg';

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
      min={props.opening.leftDistance + props.opening.length + (3 * studSection.width)}
      max={6000}
    />

    <label className="block mb-1">Hauteur en mm :</label>
    <input
      className="block w-full border rounded py-2 px-3"
      type="number"
      name="height"
      value={props.wall.height}
      onChange={props.handleWallChange}
      min={props.wall.hasOpening ? props.opening.sill + props.opening.height + studSection.width + studSection.width + studSection.height : 3 * studSection.width}
      max={4000}
    />
    <input 
      className="block w-full my-2 mb-4"
      type="range"
      name="height"
      value={props.wall.height}
      onChange={props.handleWallChange}
      min={props.wall.hasOpening ? props.opening.sill + props.opening.height + studSection.width + studSection.width + studSection.height : 3 * studSection.width}
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

    <div className="flex">
      <div className="flex-1 m-2 p-4 hover:bg-orange-200 rounded-lg">
        {props.wall.hasOpening && props.opening.isDoor ? <button 
          className="w-full focus:outline-none"
          type="button"
          onClick={() => {props.toogleDoor(false)}}
        ><DoorSelectedSVG /></button> : <button
          className="w-full focus:outline-none"
          type="button"
          onClick={() => {props.toogleDoor(true)}}
        ><DoorSVG /></button>}
      </div>

      <div className="flex-1 m-2 p-4 hover:bg-orange-200 rounded-lg">
        {props.wall.hasOpening && !props.opening.isDoor ? <button 
          className="w-full focus:outline-none"
          type="button"
          onClick={() => {props.toogleWindow(false)}}
        ><WindowSelectedSVG /></button> : <button
          className="w-full focus:outline-none"
          type="button"
          onClick={() => {props.toogleWindow(true)}}
        ><WindowSVG /></button>}
      </div>
    </div>

    {props.wall.hasOpening && <div>
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
        min={studSection.width}
        max={props.wall.length - (props.opening.leftDistance + 3 * studSection.width)}
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
        min={3 * studSection.width}
        max={props.wall.length - (props.opening.length + 3 * studSection.width)}
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
        max={props.wall.height - (props.opening.sill + studSection.width + studSection.width + studSection.height)}
      />

      {!props.opening.isDoor && <div>
        <label className="block mb-1">Hauteur d'allège en mm :</label>
        <input
          className="block w-full mb-1 border rounded py-2 px-3"
          type="number"
          name="sill"
          value={props.opening.sill}
          onChange={props.handleOpeningChange}
          min={studSection.width}
        />
        <input 
          className="block w-full my-2"
          type="range"
          name="sill"
          value={props.opening.sill}
          onChange={props.handleOpeningChange}
          min={studSection.width}
          max={props.wall.height - (props.opening.height + (2 * studSection.width) + studSection.height)}
        />
      </div>}
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
    opening: [],
    wallStuds: [],
    openingStuds: [],
  };

  componentDidMount() {
    this.calculateStuds(this.state.wall, this.state.opening);
 }

   handleWallChange = event => {
    const wall = Object.assign({}, this.state.wall);
    wall[event.target.name] = parseInt(event.target.value);

    this.calculateStuds(wall, this.state.opening);
  };

  handleOpeningChange = event => {
    const opening = Object.assign({}, this.state.opening);
    opening[event.target.name] = parseInt(event.target.value);

    this.calculateStuds(this.state.wall, opening);
  };

  toogleDoor = isDoor => {
    const wall = Object.assign({}, this.state.wall);
    let opening = isDoor ? Object.assign({}, this.defaultOpening) : [];
    wall.hasOpening = isDoor;
    
    if (isDoor) {
      opening.isDoor = isDoor
      opening.height = this.state.wall.height - (2*studSection.width + studSection.height);
      opening.sill = 0;
      wall.hasOpening = true;
    } 

    this.calculateStuds(wall, opening);
  };

  toogleWindow = hasOpening => {
    const wall = Object.assign({}, this.state.wall);
    wall.hasOpening = hasOpening;
    const opening = hasOpening ? Object.assign({}, this.defaultOpening) : [];
    
    if (hasOpening) {
      const globalHeight = this.state.wall.height - (2*studSection.width + studSection.height);
      opening.height = Math.round(globalHeight / 2 - 1);
      opening.sill = Math.round(globalHeight / 2);
    }

    this.calculateStuds(wall, opening);
  }

  calculateStuds(wall, opening) {
    let wallStuds = calculateWallStuds(wall);

    let openingStuds = [];

    if (wall.hasOpening) {
      openingStuds = calculateOpeningStuds(opening, wall);
      wallStuds = adaptWallStudsToOpening(wallStuds.concat(openingStuds), wall, opening);
    }

    this.setState({
      wall,
      opening,
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

            <OpeningForm 
              wall={this.state.wall}
              opening={this.state.opening}
              handleOpeningChange={this.handleOpeningChange}
              toogleDoor={this.toogleDoor}
              toogleWindow={this.toogleWindow}
            />

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

export default App;
