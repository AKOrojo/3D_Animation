/**
 * Cells workshop starter for IS51030B Graphics
 * Create a 3D sphere-shaped container of virtual "cells"
 * 
 * by Evan Raskob, 2021 <e.raskob@gold.ac.uk>
 */


// add a color property to the cell
// add a texture to the cell


let cells = []; // array of cells objects

/**
 * Initialise the cells array with a number of new Cell objects
 * 
 * @param {Integer} maxCells Number of cells for the new array
 * @returns {Array} array of new Cells objects 
 */
function createCellsArray(maxCells)
{
  // EXERCISE: finish this function. It should: 
  // Create an empty new array, fill it with maxCells number of cells, return the array

  // steps:

  // 1. create new variable for empty array (to return at end)
  // 2. add a new Cell to the array *maxCells* times (for loop?)
  // 2b. maybe use random vectors for position and velocity
  // 3. return the array variable
}


/**
 * Exercise: draw each of the cells to the screen
 * @param {Array} cellsArray Array of Cell objects to draw 
 */
function drawCells3D(cellsArray){
  // Loop through the cells array, for each cell:
  // 1. update the cell (call the update function)
  // 2. draw the cell (first push the drawing matrix) 
  // 2.1. translate to cell's position
  // 2.2 draw a sphere with the cell diameter
  // 2.3 pop the drawing matrix
}



/**
 * Check collision between two cells (overlapping positions)
 * @param {Cell} cell1 
 * @param {Cell} cell2 
 * @returns {Boolean} true if collided otherwise false
 */
function checkCollision(cell1, cell2)
{
 // Exercise: finish this (see the online notes for a full explanation)
 //  
 // 1. find the distance between the two cells using p5.Vector's dist() function
 // 2. if it is less than the sum of their radii, they are colliding
 // 3. return whether they are colliding, or not 
}


/**
 * Collide two cells together
 * @param {Array} cellsArray Array of Cell objects to draw 
 */
function collideCells(cellsArray) 
{
  // 1. go through the array
  for (let cell1 of cellsArray)
  {
    for (let cell2 of cellsArray)
    {
      if (cell1 !== cell2) // don't collide with itself or *all* cells will bounce!
      {
        if (checkCollision(cell1,cell2)) {
          // get direction of collision, from cell2 to cell1
          let collisionDirection = p5.Vector.sub(cell1.getPosition(), cell2.getPosition()).normalize();
          cell2.applyForce(collisionDirection);
          cell1.applyForce(collisionDirection.mult(-1)); // opposite direction
        }
      }
    }
  }
}

/**
 * Constrain cells to sphere world boundaries.
 * @param {Array} cellsArray Array of Cell objects to draw 
 */
function constrainCells(cellsArray, worldCenterPos, worldDiameter) 
{
  // 1. go through the array
  for (let cell of cellsArray)
  {
    cell.constrainToSphere(worldCenterPos,worldDiameter);
  }
}




function setup() {
  createCanvas(800, 600, WEBGL);

  
  // Exercise 1: test out the constructor function

  let testCell = new Cell({
    position: createVector(1,2,3),
    velocity: createVector(-1,-2,-3)
  });
  
  console.log("Testing cell:");
  console.log(testCell);

  // This is for part 2: creating a list of cells
  // cells = createCellsArray(5);
  // console.log(cells)
}


///----------------------------------------------------------------------------
/// p5js draw function 
///---------------------------------------------------------------------------
function draw() {

  orbitControl(); // camera control using mouse

  //lights(); // we're using custom lights here
  directionalLight(180,180,180, 0,0,-width/2);
  directionalLight(255,255,255, 0,0,width/2);
  
  ambientLight(60);
  pointLight(200,200,200, 0,0,0, 50);
  noStroke();
  background(80); // clear screen
  fill(220);
  ambientMaterial(80, 202, 94); // magenta material
  
  
  collideCells(cells); // handle collisions
  constrainCells(cells, createVector(0,0,0), width); // keep cells in the world
  drawCells3D(cells); // draw the cells

  // draw world boundaries
  ambientMaterial(255, 102, 94); // magenta material for subsequent objects
  sphere(width); // this is the border of the world, a little like a "skybox" in video games
}
