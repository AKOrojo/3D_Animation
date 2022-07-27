/**
 * Cells workshop starter for IS51030B Graphics
 * Create a 3D sphere-shaped container of virtual "cells"
 *
 * by Evan Raskob, 2021 <e.raskob@gold.ac.uk>
 */

// add a color property to the cell
// add a texture to the cell

let cells = []; // array of cells objects
let cells1 = [];

//3D SPECTACULE
let v = [];
let rows = 60,
  cols = 120;

let canvas;

let pNumSlider, pLenSlider, diameterSlider, pSharpSlider;
let petalNum, pLength, diameter, pSharpness;

let heightSlider, curvatureSlider1, curvatureSlider2;
let flowerHeight, curvature1, curvature2;

let bumpSlider, bumpNumSlider;
let bump, bumpNum;

let pNum, fD, pLen, pSharp;
let fHeight, curve1, curve2;
let b, bNum;

/**
 * Initialise the cells array with a number of new Cell objects
 *
 * @param {Integer} maxCells Number of cells for the new array
 * @returns {Array} array of new Cells objects
 */
function createCellsArray(maxCells, cellsArray) {
  // EXERCISE: finish this function. It should:
  // Create an empty new array, fill it with maxCells number of cells, return the array

  // steps:

  // 1. create new variable for empty array (to return at end)
  // 2. add a new Cell to the array *maxCells* times (for loop?)
  // 2b. maybe use random vectors for position and velocity
  // 3. return the array variable
  randType = ["Torus", "Sphere", "Cone", "Cylinder"];

  for (i = 0; i < maxCells; i++) {
    let randCell = new Cell({
      position: p5.Vector.random3D().mult(100),
      diameter: random(20, 40), // in pixels
      life: floor(random(0, 1000)),
      type: randType[floor(random() * randType.length)],
    });
    cellsArray.push(randCell);
  }
  return cellsArray;
}

/**
 * Exercise: draw each of the cells to the screen
 * @param {Array} cellsArray Array of Cell objects to draw
 */
function drawCells3D(cellsArray) {
  // Loop through the cells array, for each cell:
  // 1. update the cell (call the update function)
  // 2. draw the cell (first push the drawing matrix)
  // 2.1. translate to cell's position
  // 2.2 draw a sphere with the cell diameter
  // 2.3 pop the drawing matrix
  for (let cell of cellsArray) {
    cell.update();
    push();
    translate(cell.getPosition().x, cell.getPosition().y, cell.getPosition().z);
    switch (cell._type) {
      case "Sphere":
        sphere(cell.getDiameter());
        break;

      case "Torus":
        torus(cell.getDiameter());
        break;

      case "Cone":
        cone(cell.getDiameter());
        break;

      case "Cylinder":
        cylinder(cell.getDiameter());
        break;

      default:
        plane(cell.getDiameter());
    }
    pop();
  }
}

/**
 * Check collision between two cells (overlapping positions)
 * @param {Cell} cell1
 * @param {Cell} cell2
 * @returns {Boolean} true if collided otherwise false
 */
function checkCollision(cell1, cell2) {
  // Exercise: finish this (see the online notes for a full explanation)
  //
  // 1. find the distance between the two cells using p5.Vector's dist() function
  // 2. if it is less than the sum of their radii, they are colliding
  // 3. return whether they are colliding, or not
  let r1 = dist(
    cell1.getPosition().x,
    cell1.getPosition().y,
    cell2.getPosition().x,
    cell2.getPosition().y
  );
  let r2 = cell1.getDiameter() / 2 + cell2.getDiameter() / 2;
  if (r1 < r2) {
    return true;
  } else {
    return false;
  }
}

/**
 * Collide two cells together
 * @param {Array} cellsArray Array of Cell objects to draw
 */
function collideCells(cellsArray) {
  // 1. go through the array
  for (let cell1 of cellsArray) {
    for (let cell2 of cellsArray) {
      if (cell1 !== cell2) {
        // don't collide with itself or *all* cells will bounce!
        if (checkCollision(cell1, cell2)) {
          // get direction of collision, from cell2 to cell1
          let collisionDirection = p5.Vector.sub(
            cell2.getPosition(),
            cell1.getPosition()
          ).normalize();
          cell1.applyForce(collisionDirection);
          cell2.applyForce(collisionDirection.mult(-2)); // opposite direction
        }
      }
    }
  }
}

function reverseCollideCells(cellsArray) {
  // 1. go through the array
  for (let cell1 of cellsArray) {
    for (let cell2 of cellsArray) {
      if (cell1 !== cell2) {
        // don't collide with itself or *all* cells will bounce!
        if (checkCollision(cell1, cell2)) {
          // get direction of collision, from cell2 to cell1
          let collisionDirection = p5.Vector.sub(
            cell2.getPosition(),
            cell1.getPosition()
          ).normalize();
          cell1.applyForce(collisionDirection);
          cell2.applyForce(collisionDirection.mult(-3)); // opposite direction
        }
      }
    }
  }
}

/**
 * Constrain cells to sphere world boundaries.
 * @param {Array} cellsArray Array of Cell objects to draw
 */
function constrainCells(cellsArray, worldCenterPos, worldDiameter) {
  // 1. go through the array
  for (let cell of cellsArray) {
    cell.constrainToSphere(worldCenterPos, worldDiameter);
  }
}

function handleLife(cellsArray) {
  for (let i = 0; i < cellsArray.length; i++) {
    if (cellsArray[i].getLife() == 0) {
      cellsArray.splice(i, 1);
    }
  }
}

function mitosis(cellsArray) {
  for (let i = 0; i < cellsArray.length; i++) {
    if (cellsArray[i].getLife() == 0) {
      probability = floor(random(0, 100));
      if (probability <= 55) {
        let CellA = new Cell({
          position: p5.Vector.random3D().mult(100),
          diameter: random(20, 40),
        });
        let CellB = {
          position: p5.Vector.random3D().mult(100),
          diameter: random(20, 40),
        };
        cellsArray.push(CellA);
        cellsArray.push(CellB);
      }
      cellsArray.splice(i, 1);
    }
  }
}

function vShape(A, r, a, b, c) {
  return A * pow(Math.E, -b * pow(abs(r), c)) * pow(abs(r), a);
}

function bumpiness(A, r, f, angle) {
  return 1 + A * pow(r, 2) * sin(f * angle);
}

function setup() {
  createCanvas(800, 600, WEBGL);

  // Exercise 1: test out the constructor function

  let testCell = new Cell({
    position: createVector(1, 2, 3),
    velocity: createVector(-1, -2, -3),
  });

  console.log("Testing cell:");
  console.log(testCell);

  // This is for part 2: creating a list of cells
  cells = createCellsArray(30, cells);
  console.log(cells);

  cells1 = createCellsArray(40, cells1);
  console.log(cells1);

  //3D SPECTACLE
  // colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);
  noStroke();

  petalNum = createDiv();
  petalNum.class("valueDisplay");
  pNumSlider = createSlider(1, 20, 5, 1);
  pNumSlider.class("Slider");

  diameter = createDiv();
  diameter.class("valueDisplay");
  diameterSlider = createSlider(20, 250, 200, 10);
  diameterSlider.class("Slider");

  pLength = createDiv();
  pLength.class("valueDisplay");
  pLenSlider = createSlider(0, 300, 60, 10);
  pLenSlider.class("Slider");

  pSharpness = createDiv();
  pSharpness.class("valueDisplay");
  pSharpSlider = createSlider(0.0, 10.0, 0.4, 0.1);
  pSharpSlider.class("Slider");

  flowerHeight = createDiv();
  flowerHeight.class("valueDisplay");
  heightSlider = createSlider(0, 600, 300, 10);
  heightSlider.class("Slider");

  curvature1 = createDiv();
  curvature1.class("valueDisplay");
  curvatureSlider1 = createSlider(0.0, 4.0, 0.8, 0.1);
  curvatureSlider1.class("Slider");

  curvature2 = createDiv();
  curvature2.class("valueDisplay");
  curvatureSlider2 = createSlider(0.0, 1.0, 0.2, 0.05);
  curvatureSlider2.class("Slider");

  bump = createDiv();
  bump.class("valueDisplay");
  bumpSlider = createSlider(0.0, 5.0, 2.5, 0.5);
  bumpSlider.class("Slider");

  bumpNum = createDiv();
  bumpNum.class("valueDisplay");
  bumpNumSlider = createSlider(0, 20, 10, 1);
  bumpNumSlider.class("Slider");
}

///----------------------------------------------------------------------------
/// p5js draw function
///---------------------------------------------------------------------------
function draw() {
  orbitControl(); // camera control using mouse

  // lights(); // we're using custom lights here
  directionalLight(180, 180, 180, 0, 0, -width / 2);
  directionalLight(255, 255, 255, 0, 0, width / 2);

  ambientLight(60);
  pointLight(200, 200, 200, 0, 0, 0, 50);
  noStroke();
  background(80); // clear screen
  fill(220);
  ambientMaterial(80, 202, 94); // magenta material

  // 3D SPECTACULE
  orbitControl(4, 4);

  rotateX(60);

  pNum = pNumSlider.value();
  fD = diameterSlider.value();
  pLen = pLenSlider.value();
  pSharp = pSharpSlider.value();

  fHeight = heightSlider.value();
  curve1 = curvatureSlider1.value();
  curve2 = curvatureSlider2.value();

  b = bumpSlider.value();
  bNum = bumpNumSlider.value();

  for (theta = 0; theta < rows; theta += 1) {
    v.push([]);
    for (let phi = 0; phi < cols; phi += 1) {
      let r =
        ((pLen * pow(abs(sin(((pNum / 2) * phi * 360) / cols)), pSharp) + fD) *
          theta) /
        rows;
      let x = r * cos((phi * 360) / cols);
      let y = r * sin((phi * 360) / cols);
      let z =
        vShape(fHeight, r / 100, curve1, curve2, 1.5) -
        200 +
        bumpiness(b, r / 100, bNum, (phi * 360) / cols);

      let pos = createVector(x, y, z);
      v[theta].push(pos);
    }
  }

  for (let theta = 0; theta < v.length; theta++) {
    fill(340, 100 - theta, 100);
    for (let phi = 0; phi < v[theta].length; phi++) {
      if (theta < v.length - 1 && phi < v[theta].length - 1) {
        beginShape();
        vertex(v[theta][phi].x, v[theta][phi].y, v[theta][phi].z);
        vertex(v[theta + 1][phi].x, v[theta + 1][phi].y, v[theta + 1][phi].z);
        vertex(
          v[theta + 1][phi + 1].x,
          v[theta + 1][phi + 1].y,
          v[theta + 1][phi + 1].z
        );
        vertex(v[theta][phi + 1].x, v[theta][phi + 1].y, v[theta][phi + 1].z);
        endShape(CLOSE);
      } else if (theta < v.length - 1 && phi == v[theta].length - 1) {
        beginShape();
        vertex(v[theta][phi].x, v[theta][phi].y, v[theta][phi].z);
        vertex(v[theta][0].x, v[theta][0].y, v[theta][0].z);
        vertex(v[theta + 1][0].x, v[theta + 1][0].y, v[theta + 1][0].z);
        vertex(v[theta + 1][phi].x, v[theta + 1][phi].y, v[theta + 1][phi].z);
        endShape(CLOSE);
      }
    }
  }

  petalNum.html("Number of the petals: " + pNumSlider.value());
  diameter.html("Diameter: " + diameterSlider.value());
  pLength.html("Petal length: " + pLenSlider.value());
  pSharpness.html("Petal sharpness: " + pSharpSlider.value());

  flowerHeight.html("Flower height: " + heightSlider.value());
  curvature1.html("Curvature 1: " + curvatureSlider1.value());
  curvature2.html("Curvature 2: " + curvatureSlider2.value());

  bump.html("Bumpiness: " + bumpSlider.value());
  bumpNum.html("Bumpiness number: " + bumpNumSlider.value());

  v = [];

  handleLife(cells);
  collideCells(cells, 1); // handle collisions
  constrainCells(cells, createVector(0, 0, 0), width); // keep cells in the world
  drawCells3D(cells); // draw the cells
  //mitosis(cells);

  fill(300);
  ambientMaterial(255, 0, 255);
  handleLife(cells1);
  reverseCollideCells(cells1); // handle collisions
  constrainCells(cells1, createVector(0, 0, 0), width); // keep cells in the world
  drawCells3D(cells1); // draw the cells

  // draw world boundaries
  ambientMaterial(255, 102, 94); // magenta material for subsequent objects
  sphere(width); // this is the border of the world, a little like a "skybox" in video games
}
