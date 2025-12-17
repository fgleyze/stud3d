import React from 'react'
import Canvas3d from './Canvas3d.jsx';
import Collapsible from './Collapsible.jsx';
import TitleExplained from './TitleExplained.jsx';
import {studSection, junctions, calculateWallStuds, calculateOpeningStuds, adaptWallStudsToOpening} from "./studsCalculator.js";
import { ReactComponent as DoorSVG } from './assets/svg/door.svg';
import { ReactComponent as DoorSelectedSVG } from './assets/svg/door_selected.svg';
import { ReactComponent as WindowSVG } from './assets/svg/window.svg';
import { ReactComponent as WindowSelectedSVG } from './assets/svg/window_selected.svg';
import rpIcon from './assets/rp-icon.png';

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

  return <Collapsible
    isOpen={false} 
    title="Mur"
  >
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
  </Collapsible>
}

function OpeningForm(props) {
  return <Collapsible
    title="Ouverture"
    isOpen={false}
  >

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
  </Collapsible>
}

function StudSections(props) {
  let lengths = [];
  
  for (let stud of props.studs) {
    if (stud.dimensions[0] !== studSection.width && stud.dimensions[0] !== studSection.height) {
      lengths.push(stud.dimensions[0]);
    } else if (stud.dimensions[1] !== studSection.width && stud.dimensions[0] !== studSection.height){
      lengths.push(stud.dimensions[1]);
    } else if  (stud.dimensions[2] !== studSection.width && stud.dimensions[0] !== studSection.height) {
      lengths.push(stud.dimensions[2]);
    }
  }
  
  let sections = [];

  let uniqueLengths = lengths;
  var count = {};
  uniqueLengths.forEach(function(i) { count[i] = (count[i]||0) + 1;});

  Object.keys(count).forEach(function(key) {
    if (key == 0 || count[key] == 0) {
      return;
    }
    sections.push(<p key={key}>{count[key]} x <b>{key} mm</b></p>);
  });

  return <Collapsible
    title="Sections "
    isOpen={true}
  >
    <div className="px-6 py-4 mb-4 border-2 border-black border-dashed text-xl">
      {sections}
    </div>
    <div className="p-4 text-justify bg-orange-200 text-sm rounded-lg">
      <p>Les sections standard font <strong>{studSection.width + " mm x " + studSection.height + " mm"}</strong>. Les linteaux sont ici constitués de 3 sections standards mais doivent être <a href="https://fr.twiza.org/article/86/info-bois-n-1-les-abaques" target="_blank" rel="noopener noreferrer">adaptés à l'ouverture.</a></p>
    </div>
  </Collapsible>;
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
    isMenuOpen: false,
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

  toogleMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
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
    let opening = [];
    wall.hasOpening = isDoor;
    
    if (isDoor) {
      opening = Object.assign({}, this.defaultOpening);
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
    let opening = [];
    
    if (hasOpening) {
      opening = Object.assign({}, this.defaultOpening);
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
      <div className="flex h-screen w-screen overflow-hidden">
        <div
          className={"mainMenu relative " + (!this.state.isMenuOpen ? "is-hidden" : "")}
        >

        <button className={"mainMenu-hamburger hamburger--elastic absolute top-0 w-2 m-6 focus:outline-none " + (this.state.isMenuOpen ? "is-active" : "")}
          type="button" onClick={this.toogleMenu}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>  

        <div className="mainMenu-scrollbar h-full overflow-y-auto border-r border-solid border-gray-300">
          <div className="px-4">
            <TitleExplained 
              isOpen={false}
            />
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
        </div>
        <div className="flex-1">
          <Canvas3d
            height={this.state.wall.height}
            length={this.state.wall.length}
            studs={this.state.wallStuds.concat(this.state.openingStuds)}
          />
        </div>
        <a href="https://www.racines-perspectives.fr" target="_blank" rel="noopener noreferrer" className="absolute bottom-0 right-0 p-4 flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <span className="text-sm">Par Racines & Perspectives</span>
          <img className="h-6" src={rpIcon} alt="Racines & Perspectives" />
        </a>
      </div>
    );
  }
}

export default App;

