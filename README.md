# Resit_Lab_2-_3D_animation
In this assignment the goal is to create a virtual world of “cells” moving in 3D space with some simple physics, as in the video. We’ll explore vectors, forces, collisions, and play more with 3D spaces.

Watch the completed cells example video

(If you can’t view the video above, try this link)

Instructions
Before you begin: the files to edit
1: Finishing the Cell class (10%)
Subtask 1: Constructors
Subtask 2: Setters and getters
Subtask 3: Finishing the Cell update() function
Trying it out and debugging
2: Creating a list of cells (10%)
Trying it out
3: Drawing cells (10-20%)
Trying it out
4: Check collisions between cells (10%)
Finish checkCollision()
Trying it out
5: Handling collisions: repelling
6: Aging (10%)
Try it out
Extra: Better drawing
Extra: Repelling Cells
Extra: Mitosis
Extra: Surprise us
Document your work
Before you submit
Instructions
download the code project from here
follow the steps below
check the assignment rubric on the assignment page on the VLE to make sure you’ve done all the tasks
improvise and experiment!
Before you begin: the files to edit
This example starts with a Cell class contained in the cell.js file. This file is included by the index.html file as shown here:

<script src="cell.js"></script>
<script src="sketch.js"></script>
Order is important! The cell.js needs to be before the sketch.js or you will get errors because p5js won’t be able to find it when it loads.

1: Finishing the Cell class (10%)
Start with the cell.js file and finish the Cell class.

Finish the Constructor function
Create setter and getter functions for all variables: diameter, position, velocity, life
Create an update() function
Subtask 1: Constructors
The first task is to create a better Contructor function for the Cell objects. We want to be able to easily define a cell using object property names and not just a list of parameters.

For example, this is the usual way we have been creating new objects using parameter lists:

// create a cell object with random properties
let randCell = new Cell(
  p5.Vector.random3D().mult(2), // What was this?? 
  p5.Vector.random3D().mult(0.1), // and this ?
  random(20,40),
  60*3
});
This has problems: we might forget the order of the variables, or leave one out and get errors!
Once this new Contructor function is finished, we should be able to create a new Cell object in the sketch.js file using code like this:

// create a new cell object
let newCell = new Cell(
{
    position: createVector(0,0,0), 
    velocity: createVector(0,0,0),
    diameter: 20, // in pixels
    life: 60*3 // specified in life per frame rendered
});
Remember that { } is a way to create an object literal like let obj = { x:0, y:20, z:12 }, which gives us a variable called obj with properties obj.x, obj.y, obj.z.
There’s a quick way to use objects as function arguments in ES6 JavaScript where you just tell the function the object properties and they become variable names:

// declare Contructor variables:

function Cell({position, velocity, diameter, life}) {
    this.position = position;
    // etc., same for velocity, life, etc.

    // print these out for debugging:
    console.log("position:" + position);
    console.log("velocity:" + velocity);
}

// set a new Cell's position variable in the Constructor:
let cell = new Cell ({position: createVector(1,2,3)});

console.log(cell.position); 
// prints the Vector [1,2,3]
Let’s finish the constructor function for this class by taking those object arguments to function Cell() and saving them as class properties like this._position and this._velocity etc. These all start with an underscore _ to show they are internal the the Cell class only.

Finish the rest of the function by checking to see if the object property for each internal property is undefined (not included) and if so provide a default, but if not, copy the value like with position and this._position below. (This is around line 24 of the cell.js file):

function Cell({position, velocity, diameter, life}) {

// handle position
if (position === undefined) { // if it wasn't passed in
      // create default vector
      this._position = createVector(0,0,0);
    }
    else this._position = position; // use object property passed in
}
Subtask 2: Setters and getters
In this class we use getter and setter functions to access and change our internal variables like with myCell.getPosition() to get the diameter, so outside code doesn’t mess with them directly:
this.getPosition = function()
{
    return this._position;
}

this.setPosition = function(position) {
    this._position = position;
}
Your task is to create setters and getters for all the internal variables in the cell class: diameter, position, velocity, life. You’ll use them later on.
Note: There’s actually an even better way to do this in ES6 using get and set shorthand, but we’re not going to do that just yet.
Subtask 3: Finishing the Cell update() function
Find the function this.update() around line 79. Finish the last 2 lines of code as per the instructions to get the cell moving according to its acceleration and velocity.

Trying it out and debugging
If you’ve done this correctly, you should be able to load up the project in your web browser, open the JavaScript console, and then see all the properties of your new cell printed out. Make a few tests with different combinations of arguments so you know it works in all cases.

2: Creating a list of cells (10%)
Now, swap to the sketch.js file to finish this up.
At the top of the file (near line 13) you’ll find the array of cells objects that represent the moving, green spheres: let cells = []; // array of cells objects
Below that is an unfinished function called function createCellsArray(maxCells) that will create a new list of cells and return them. Finish it as per the instructions in the code.
To help you, this following code example uses our new constructor to create a new cell with a random position and diameter between 20 and 40 pixels, we can do something like:

// create a cell object with random properties
    let randCell = new Cell(
    {
        position: p5.Vector.random3D().mult(2), 
        diameter: random(20,40)
    });
Trying it out
If correct, in setup() there should be some lines you can uncomment that use console.log to call your new function and print out your new list of cells to check that all is well.

3: Drawing cells (10-20%)
Now that you can make a list of cells, let’s do something fun with them and draw them to the screen!

Find the function drawCells3D(cellsArray) which should draw any array of cell objects as 3D objects.

Follow the instructions to finish the function. Here’s a hint, you can more easily loop through an array and do things with each and every object in the array using:

for (let cell of cellsArray)
{
    cell.update();
}
Trying it out
Once you’ve finished that, try it out. Make sure that in setup you are creating your new array (from the previous step): cells = createCellsArray(5);
Now you should see some random spheres being drawn, hopefully moving if you got the update() function working!
4: Check collisions between cells (10%)
A “collision” is when one Cell is overlapping with another Cell.
That means their position plus their radius is within another Cell’s position plus its radius, like two overlapping circles.
In other words, if the distance between two cell’s centre points is less than the sum of their radii, they are overlapping and thus colliding as in the picture.
circle collision
circle collision
Showing cells colliding (overlapping, top) and not colliding (bottom)

Finish checkCollision()
Find the checkCollision(cell1, cell2) function (line 56 or so) that takes two cells and decides if they are colliding
Finish it according to the instructions
Trying it out
If you did it correctly, you shouldn’t see any errors and cells should be bouncing off one another! (See draw())
5: Handling collisions: repelling
Find the function function collideCells(cellsArray) which handles collisions for all cells in an array
If cells collide, they will repel each other by applying an accelerating force to each other in the opposite direction of their collision. Greater values will result in greater bounces.
Try tweaking the physics by changing how much they bounce off one another.
6: Aging (10%)
Cells age (i.e. lose life) over time. When they are out of life, they should be removed from the simulation (and cells array).
In the Cell class update() function, decrease the cell’s _life property by 1 every time update() is run.
In your sketch, create a new function called handleLife(cellsArray) that takes an array of cells, loops through it and finds cells that have a life of 0 or less.
Each of those “old” cells should be removed from the array. To remove it you’ll need to combine two useful array functions, splice (see documentation and indexOf (see documentation).
Try it out
Call this new function in draw, before checking for collisions. If you’ve done things right your cells will all suddenly disappear in a little bit.
Then: in the createCellsArray() set the life properties of each cell to something random so they don’t all disappear at once!
Extra: Better drawing
This is for after you get the basic version working. There are lots of fun things you could do for drawing, like making the cells pulse different colours, add textures, change the shapes, using rotations etc… you can also use time-based animations instead of frame-based ones for smoother animation.

You can create different “types” of cells so that they can be drawn differently in drawCells3D(). Instead of just drawing a sphere, use a switch() statement to decide how to draw each individual cell. Of course, that means creating a new Cell class property named type that can be a string like "sphere" and initialising it in the Cell constructor!

Then you can draw it in drawCells3D() like so:

switch (cell.type) {
    case "sphere":
    sphere(cell.getDiameter());
    break;

    case "torus":
    // draw a torus?
    break;

    default: plane(cell.getDiameter()); // why not?
}
Extra: Repelling Cells
Create another array of cells that repel cells, to get some interesting behaviors. Maybe draw them differently so you can see them on screen.
For every cell in this array, apply a force to all cells in the original array in the opposite direction (like the collideCells() function, and also using a nested array).
Extra: Mitosis
Write a function in the sketch.js that randomly divides a cell into two “babies” at the parent cell’s location, if it is old enough. Call it mitosis and give it an array of cells as an argument.
If the life of the cell is < 10 (or a threshold you decide) then it has a 55% chance of pushing two new baby cells onto the original cells array
Make sure you splice the parent out of the cells array after it gives birth to two new cells, otherwise you will have extra cells!
Extra: Surprise us
How about something else? Run it by us in VCT sessions and then make it work and get another 5-8 points.
Document your work
Explain under your sketch.js and cell.js in comments all of the sections where you have been particularly inventive (this can be in bulletpoints, no need for an essay!).
If your new functionalities require some sort of interaction from us, make sure you say what we need to press or do to enable them.
Make sure your code is well commented.
Before you submit
Make sure you submit your entire sketch as a single zip file.
