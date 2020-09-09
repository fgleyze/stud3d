 const studTypes = {
    commonStud: "commonStud",
    bottomPlate: "bottomPlate",
    other: "other",
}

const studSection = {
    height: 145, 
    width: 45
}

const junctions = {
    femaleStraigth: 0,
    maleStraigth: 1,
    femaleCorner: 2,
} 

function calculateWallStuds(wall) {
    const length = wall.length ;
    const height = wall.height ;
    const leftJunction = wall.leftJunction ;
    const rightJunction = wall.rightJunction ;
  
    const doubleTopPlate = {
      length: length - 2 * studSection.height,
      positionX: studSection.height,
    }
  
    // calculate double top plate length
    if (leftJunction == junctions.maleStraigth && rightJunction == junctions.maleStraigth) {
      doubleTopPlate.length = length + 2 * studSection.height;
      doubleTopPlate.positionX = -studSection.height;
    } else if (leftJunction == junctions.maleStraigth) {
      doubleTopPlate.length = length;
      doubleTopPlate.positionX = -studSection.height;
    } else if (rightJunction == junctions.maleStraigth) {
      doubleTopPlate.length = length;
      doubleTopPlate.positionX = studSection.height;
    }
  
    let studs = [
      // bottom plate
      {
        dimensions: [length, studSection.width, studSection.height],
        positions: [0, 0, 0],
        type: studTypes.bottomPlate,
      },
      // top plate
      {
        dimensions: [length, studSection.width, studSection.height],
        positions: [0, height - (2 * studSection.width), 0],
        type: studTypes.other,
      },
      // double top plate
      {
        dimensions: [doubleTopPlate.length, studSection.width, studSection.height],
        positions: [doubleTopPlate.positionX, height - studSection.width, 0],
        type: studTypes.other,
      },
      // last common stud
      {
        dimensions: [studSection.width, height - (3 * studSection.width), studSection.height],
        positions: [length - studSection.width, studSection.width, 0],
        type: studTypes.other,
      },
    ];
    
    // common studs
    for ( let offset = 0; offset < (rightJunction == junctions.femaleCorner ? length - (studSection.height + studSection.width * 2) : length - (2 * studSection.width)); offset += (600 + studSection.width) ) {
      studs.push({
        dimensions: [studSection.width, height - (3 * studSection.width), studSection.height],
        positions: [offset, studSection.width, 0],
        type: studTypes.commonStud,
      })
    }
  
    // left corner female junction stud
    if (leftJunction == junctions.femaleCorner) {
      studs.push({
        dimensions: [studSection.height, height - (3 * studSection.width), studSection.width],
        positions: [studSection.width, studSection.width, 100],
        type: studTypes.other,
      });
    }
  
    // right corner female junction stud
    if (rightJunction == junctions.femaleCorner) {
      studs.push({
        dimensions: [studSection.height, height - (3 * studSection.width), studSection.width],
        positions: [length - (studSection.width + studSection.height), studSection.width, 100],
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
        dimensions: [studSection.width, wallHeight - (3 * studSection.width), studSection.height],
        positions: [leftDistance - (studSection.width * 2), studSection.width, 0],
        type: studTypes.other,
      },
      // right king stud
      {
        dimensions: [studSection.width, wallHeight - (3 * studSection.width), studSection.height],
        positions: [leftDistance + length + studSection.width, studSection.width, 0],
        type: studTypes.other,
      },
      // header 1
      {
        dimensions: [length + (studSection.width * 2), studSection.height, studSection.width],
        positions: [leftDistance - studSection.width, sill + height, 0],
        type: studTypes.other,
      },
      // header 2
      {
        dimensions: [length + (studSection.width * 2), studSection.height, studSection.width],
        positions: [leftDistance - studSection.width, sill + height, studSection.width],
        type: studTypes.other,
      },
      // header 3
      {
        dimensions: [length + (studSection.width * 2), studSection.height, studSection.width],
        positions: [leftDistance - studSection.width, sill + height, studSection.width * 2],
        type: studTypes.other,
      },
      // left trimmer stud
      {
        dimensions: [studSection.width, !opening.isDoor ? height : height - studSection.width, studSection.height],
        positions: [leftDistance - studSection.width, !opening.isDoor ? sill : sill + studSection.width, 0],
        type: studTypes.other,
      },
      // left top trimmer stud
      {
        dimensions: [studSection.width, wallHeight - (sill + height + (2 * studSection.width) + studSection.height), studSection.height],
        positions: [leftDistance - studSection.width, sill + height + studSection.height, 0],
        type: studTypes.other,
      },
      // right trimmer stud
      {
        dimensions: [studSection.width, !opening.isDoor ? height : height - studSection.width, studSection.height],
        positions: [leftDistance + length, !opening.isDoor ? sill : sill + studSection.width, 0],
        type: studTypes.other,
      },
      // right top trimmer stud
      {
        dimensions: [studSection.width, wallHeight - (sill + height + (2 * studSection.width) + studSection.height), studSection.height],
        positions: [leftDistance + length, sill + height + studSection.height, 0],
        type: studTypes.other,
      },
    ]);
  
    // sill
    if (sill > studSection.width && sill < (2 * studSection.width)) {
      studs.push({
        dimensions: [length + (studSection.width * 2), sill, studSection.height],
        positions: [leftDistance - studSection.width, sill - studSection.width, 0],
        type: studTypes.other,
      })
    } else if (sill > (2 * studSection.width)) {
      studs.push({
        dimensions: [length + (studSection.width * 2), studSection.width, studSection.height],
        positions: [leftDistance - studSection.width, sill - studSection.width, 0],
        type: studTypes.other,
      })
    }
  
    if (sill > studSection.width) {
      // left lower trimmer stud
      studs.push(...[{
        dimensions: [studSection.width, sill - (2 * studSection.width), studSection.height],
        positions: [leftDistance - studSection.width, studSection.width, 0],
        type: studTypes.other,
      },
      // right lower trimmer stud
      {
        dimensions: [studSection.width, sill - (2 * studSection.width), studSection.height],
        positions: [leftDistance + length, studSection.width, 0],
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
  
      // remove or replace overlapping common studs
    // https://stackoverflow.com/questions/24812930/how-to-remove-element-from-array-in-foreach-loop
    studs.reduceRight(function (acc, stud, key, object) {
      if (stud.type === studTypes.commonStud && stud.positions[0] > leftDistance - (3 * studSection.width) && stud.positions[0] < leftDistance
      || stud.type === studTypes.commonStud && stud.positions[0] > (leftDistance + length) - (studSection.width) && stud.positions[0] < (leftDistance + length) + (2 * studSection.width)) {
        object.splice(key, 1);
      } else if (stud.type === studTypes.commonStud && stud.positions[0] >= leftDistance - (2 * studSection.width) && stud.positions[0] <= (leftDistance + length + studSection.width)) {
        //top jack studs
        let topJackStud = JSON.parse(JSON.stringify(object[key]));
        topJackStud.dimensions[1] = wallHeight - (sill + height + studSection.height + (2 * studSection.width));
        topJackStud.positions[1] = sill + height + studSection.height;
        object.push(topJackStud);
  
        if (sill <= studSection.width) {
          object.splice(key, 1);
        } else {
          //bottom jack studs
          let bottomJackStud = JSON.parse(JSON.stringify(object[key]));
          bottomJackStud.dimensions[1] = sill - (2 * studSection.width);
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
  
  export {studTypes, studSection, junctions, calculateWallStuds, calculateOpeningStuds, adaptWallStudsToOpening};