'use strict';


class Pong
{
  constructor(canvas)
  {
    this._move = "";
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.pixelData = this._context.getImageData(0, 0, 600, 400);

    // console.log(this.pixelData);

    this.ball = new Ball;
    this.throttle = 1;
    this.gameCount = 0;

    this.done = false;

    this.isPointOver = false;

    this.aggregateReward = 0;

    this.responseReceived = true;


    this.players = [
      new Player,
      new Player,
    ];

    this.players[0].position.x = 20;
    this.players[1].position.x = this._canvas.width - 20;
    this.playPosition();


    let lastTime;
    this.count = 99;
    let callback;

    callback = (milliseconds) => {
      if (lastTime) {
        this.update((milliseconds - lastTime) / 1000);
        this.updateReward();
        if (this.isPointOver === true) {
          this.reset();
        }
        this.draw();
      }
      // split decloration and init above.

      lastTime = milliseconds;
      requestAnimationFrame(callback);
      
      
      this.count += 1;
      // console.log(this.responseReceived);
     
      if ((this.responseReceived === true) && (this.count % this.throttle === 0)) {
        // this.draw();
        // uncomment the above line to see what the bot is seeing
        this.responseReceived = false;
        this.getMove(this.count)
        if (this.isPointOver === true) {
          this.gameCount += 1;
          console.log('game count')
          console.log(this.gameCount);
          this.aggregateReward = 0;
          this.isPointOver = false;
        }
      }
      
      
    };

    callback();
    this.reset();
  }

  playPosition() {
    this.players.forEach(player => { player.position.y = this._canvas.height / 2; });
  }

  getMove(){
    // console.log(this.count);
    // var d = new Date
    // console.log(d.getSeconds())
    // console.log(d.getMilliseconds())
    var image = 'placeholder'
    let url = `http://localhost:8000/pong/bot?&bally=${Math.round(this.ball.position.y)}&paddley=${this.players[1].position.y}&reward=${this.aggregateReward}&img=${image}`
    // let url = `http://net-positive.herokuapp.com/pong/bot?bally=${Math.round(this.ball.position.y)}&paddley=${this.players[1].position.y}&reward=${this.aggregateReward}&img=${image}`
    var that = this
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        that._move = myArr['up'];
        that.botUpdate(that._move);
        that.responseReceived = true;
      }
    };
    xmlhttp.open('GET', url, true);

    xmlhttp.send();
    
  }
 
  collide(player, ball) {
    const rightside = ball.right && player.right
    const bottom = ball.bottom && player.bottom
    if (player.left < rightside > ball.left && player.top < bottom > ball.top) {
      const length = ball.velocity.length
      ball.velocity.x = -ball.velocity.x;
      ball.velocity.y += 300 * (Math.random() - .5);
      ball.velocity.length = length * 1.05; 
    }
  }

  draw() {
    this._context.fillStyle = '#000';
    this.canvasDimensions();

    this.drawRectangle(this.ball);
    this.players.forEach(player => this.drawRectangle(player))
  }

  canvasDimensions() {
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  drawRectangle(rectangle) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
  }

  reset() {
    this.doOver();

    // console.log(`Player 1 Score: ${this.players[0].score} Player 2 Score: ${this.players[1].score}`)

    if (this.players[0].score < 21 && this.players[1].score < 21){
      this.start()    
    } else {
      this.done = true
      this.restartGame(); 
    }
  }

  doOver() {
    this.ball.position.x = this._canvas.width / 2;
    this.ball.position.y = this._canvas.height / 2;
    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
    this.players[0].position.y = this._canvas.height / 2;
    this.players[1].position.y = this._canvas.height / 2;
  }

  start() {
    if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
      this.ball.velocity.x = 300 * (Math.random() > .5 ? 1 : -1);
      this.ball.velocity.y = 300 * (Math.random() * 2 -1);
      this.ball.velocity.length = 2000;
    }
  }
  // is it worth making ball.velocity.x / y a constant or is that too much of a refactor?
  restartGame() {
    var playerId
    playerId = this.players[1].score === 21 ? 1 : 0;
    //  if (this.players[1].score === 21) {
    //   playerId = 1;
    // } else {
    //   playerId = 0
    //  commenting how this was originally written cause im tired and will forget it when explaining in future.

    this.players[playerId].game += 1
    // console.log(`Player 1 Game: ${this.players[0].game} Player 2 Game: ${this.players[1].game}`)
    this.players[0].score = 0;
    this.players[1].score = 0;
    this.done = false;
    this.start();
  }

  updateReward() {
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      if (this.ball.velocity.x < 0) {
        this.aggregateReward += 1
      } else {
        this.aggregateReward += -1;
      }
    }
  }

  update(deltatime) {
    this.ball.position.x += this.ball.velocity.x * deltatime;
    this.ball.position.y += this.ball.velocity.y * deltatime;


    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      var playerId;
      if (this.ball.velocity.x < 0) {
        playerId = 1;
        this.isPointOver = true;
      } else {
        playerId = 0;
        this.isPointOver = true;
      }
      this.players[playerId].score++;
    }

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;


      this.players.forEach(player => this.collide(player, this.ball));
      // merged this with previous if
    }
  }

  botJS() {
    if (this.ball.position.y <= this.players[1].position.y) {
      this.players[1].position.y -= 20
    } else  {
      this.players[1].position.y += 20
    }
  }

  botUpdate(moveUp) {
    if(moveUp === true) {
        this.players[1].position.y -= 20
    } else {
        this.players[1].position.y += 20
    }
  }

}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);
