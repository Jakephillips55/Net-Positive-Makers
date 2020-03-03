
class Vector
{
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }
}

class Rectangle
{
  constructor(w, h)
  {
    this.position = new Vector;
    this.size = new Vector(w, h)
  }
}

class Ball extends Rectangle
{
  constructor()
  {
    super(10, 10)
    this.velocity = new Vector;
  }
}



// creates the canvas
const canvas = document.getElementById('pong');
// makes the object 2d and includes methods and properties for drawing
const context = canvas.getContext('2d');
//creates new ball
const ball = new Ball;

// fills the canvas with black (specified width and height in html)
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);
// creates a white ball 10 x 10 pixles
context.fillStyle = '#fff';
context.fillRect(0, 0, 10, 10);