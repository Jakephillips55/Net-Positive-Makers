'use strict';

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


const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

const ball = new Ball;
ball.position.x = 100;
ball.position.y = 100;
ball.velocity.Ballx = 100;
ball.velocity.y = 100;

var  lastTime;
function callback(milliseconds) {
  if (lastTime) {
    update((milliseconds - lastTime) / 1000);
  }
  lastTime = milliseconds;
  requestAnimationFrame(callback);
}
function update(deltatime) {
  ball.position.x += ball.velocity.x * deltatime;
  ball.position.y += ball.velocity.y * deltatime;

  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#fff';
  context.fillRect(ball.position.x, ball.position.y, ball.size.x, ball.size.y);

}

callback()