"use strict";

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  set length(value) {
    const factor = value / this.length;
    this.x *= factor;
    this.y *= factor;
  }
}

class Rectangle {
  constructor(w, h) {
    this.position = new Vector;
    this.size = new Vector(w, h);
  }
  get left() {
    return this.position.x - this.size.x / 2;
  }
  get right() {
    return this.position.x + this.size.x / 2;
  }
  get top() {
    return this.position.y - this.size.y / 2;
  }
  get bottom() {
    return this.position.y + this.size.y / 2;
  }
}

class Ball extends Rectangle {
  constructor(w, h) {
    super(w, h);
    this.velocity = new Vector;
  }

  resetPosition(canvasWidth, canvasHeight) {
    this.position.x = canvasWidth / 2;
    this.position.y = canvasHeight / 2;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  updatePosition(deltatime) {
    this.position.x += this.velocity.x * deltatime;
    this.position.y += this.velocity.y * deltatime;
  }

  isOutOfPlay(canvasWidth) {
    return this.left < 0 || this.right > canvasWidth;
  }

  serve(serveSpeed) {
    this.velocity.x = (Math.random() > .5 ? 1 : -1);
    this.velocity.y = (Math.random() > .5 ? 1 : -1);
    this.velocity.length = serveSpeed;
  }

  collideTop() {
    if (this.top < 0) {
      this.velocity.y = -this.velocity.y;
      this.position.y = this.size.y/2
    }
  }

  collideBottom(canvasHeight) {
    if (this.bottom > canvasHeight) {
      this.velocity.y = -this.velocity.y;
      this.position.y = canvasHeight - this.size.y/2
    }
  }

  collideLeftPaddle(player) {
    if (this.isPaddleHit(player)) {
      this.position.x = player.paddleOffsetStart + player.size.x/2;
      this.paddleBounce();
    }
  }

  collideRightPaddle(player, canvasWidth) {
    if (this.isPaddleHit(player)) {
      this.position.x = canvasWidth - player.paddleOffsetStart - player.size.x/2;
      this.paddleBounce();
    }
  }

  isPaddleHit(player) {
    return player.left <= this.right && player.right >= this.left && player.top <= this.bottom && player.bottom >= this.top;
  }

  paddleBounce() {
    this.velocity.x = -this.velocity.x;
    this.velocity.y += this.velocity.y * (Math.random() - 0.5);
    this.velocity.length *= 1.05; 
  }
}

class Player extends Rectangle {
  constructor(w, h, paddleOffsetStart) {
    super(w, h);
    this.score = 0;
    this.game = 0;
    this.botSpeed = 12;
    this.humanSpeed = 30;
    this.velocity = new Vector;
    this.repeatActionCount = 0;
    this._moveUpBot = '';
    this.responseReceived = true;
    this.paddleOffsetStart = paddleOffsetStart;
  }

  storeMove(move) {
    this._moveUpBot = move;
    this.responseReceived = true;
    this.repeatActionCount = 0;
  }

  botMove(canvasHeight) {
    this.repeatActionCount++;
    this._moveUpBot ? this.moveUp(this.botSpeed) : this.moveDown(this.botSpeed, canvasHeight);
  }

  humanMove(canvasHeight, moveUpHuman) {
    moveUpHuman? this.moveUp(this.humanSpeed) : this.moveDown(this.humanSpeed, canvasHeight)
  }

  moveUp(moveSpeed) {
    if (this.isMoveInCourtTop(moveSpeed)) {
      this.position.y -= moveSpeed;
    }
  }

  moveDown(moveSpeed, canvasHeight) {
    if (this.isMoveInCourtBottom(moveSpeed, canvasHeight)) {
      this.position.y += moveSpeed;
    }
  }

  isMoveInCourtTop(moveSpeed) {
    return this.position.y >= moveSpeed;
  }

  isMoveInCourtBottom(moveSpeed, canvasHeight) {
    return this.position.y + moveSpeed <= canvasHeight;
  }

  resetPosition(canvasHeight) {
    this.position.y = canvasHeight / 2;
  }
}

class BotSocket extends WebSocket {
  constructor(pong, url) {
    super(url);
    this.pong = pong;
  }

  handleWebSocketResponse() {
    this.onmessage = function(e) {
      this.parseAndStore(e.data);
    }
  }

  parseAndStore(response) {
    var response = JSON.parse(response);
    var playerID = parseInt(response.playerID);
    this.pong.players[playerID].storeMove(response['moveup']);
  }

  handleWebSocketClose() {
    this.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
    }
  }
}

class ImageProcessor {
  constructor() {
    this.regex80 = /00000000000000000000000000000000000000000000000000000000000000000000000000000000/gi
    this.regex40 = /0000000000000000000000000000000000000000/gi
    this.regex20 = /00000000000000000000/gi
    this.regex10 = /0000000000/gi
    this.regex4 = /1111/gi
    this.regexW = /wwwwwwwwwwwwwwwwwwww/gi
  }

  retrievePixelData(context) {
    var image = context.getImageData(0, 0, 320, 320);
    var imageArray = Array.from(image.data);
    imageArray = this.rgbaToBinary(imageArray);
    var imageString = imageArray.join('');
    imageString = this.compressString(imageString);
    return imageString;
  }

  rgbaToBinary(imageArray) {
    imageArray = imageArray.filter(function(_, i) {return (i + 1) % 4})
    imageArray = imageArray.filter(function(_, i) {return (i + 1) % 3})
    imageArray = imageArray.filter(function(_, i) {return (i + 1) % 2})

    for (var i = 0, len = imageArray.length; i < len; i++) {
      imageArray[i] < 127 ? imageArray[i] = 0 : imageArray[i] = 1;
    }
    return imageArray;
  }

  compressString(imageString) {
    //first round of compression
    imageString = imageString.replace(this.regex80, 'w');
    imageString = imageString.replace(this.regex40, 'x');
    imageString = imageString.replace(this.regex20, 'y');
    imageString = imageString.replace(this.regex10, 'z');
    imageString = imageString.replace(this.regex4, 'a');
    // second round of compression
    imageString = imageString.replace(this.regexW, 'v');
    return imageString;
  }

}

class Pong {
  constructor(canvas) {
    this.ballHeight = 8;
    this.ballWidth = 4;
    this.paddleHeight = 32;
    this.paddleWidth = 8;
    this.paddleOffsetStart = 36;
    this.serveSpeed = 200;
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.gameFinished = false;
    this.training = false;
    this.bot = 'rl-federer';
    this.trainingOpponent = 'nodevak-djokovic';
    this.isPointOver = false;
    this.aggregateReward = 0;
    this.imageProcessor = new ImageProcessor
    this.ball = new Ball(this.ballWidth, this.ballHeight);
    this.players = [new Player(this.paddleWidth, this.paddleHeight, this.paddleOffsetStart),
                    new Player(this.paddleWidth, this.paddleHeight, this.paddleOffsetStart)];
    this.players.forEach( player => { player.position.y = this._canvas.height / 2 });
    this.players[0].position.x = this.paddleOffsetStart;
    this.players[1].position.x = this._canvas.width - this.paddleOffsetStart;
  }

  run(botSocket) {
    this.reset();
    let lastTime;
    const callback = (milliseconds) => {
      if (lastTime) {
        this.updatePaddles();
        this.updateGame((milliseconds - lastTime) / 1000);
        this.updateReward();
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
      if (this.isPointOver) {this.reset();}
      this.draw();
      if (botSocket.readyState === 1) {this.getNextBotMoves();}   
    }
    callback();
  }

  updatePaddles() {
    if (this.players[1].repeatActionCount < 3) {
      this.players[1].botMove(this._canvas.height);
    }
    if (this.players[0].repeatActionCount < 3 && this.training) {
      this.players[0].botMove(this._canvas.height);
    }
  }

  getNextBotMoves() {
    if (this.players[1].responseReceived) {
      this.getBotMove(botSocket);
    }
    if ((this.training) && (this.players[0].responseReceived)) {
      this.getTrainingOpponentMove(botSocket);
    }
  }

  getBotMove(botSocket) {
    this.players[1].responseReceived = false;
    botSocket.send(JSON.stringify({
      "court": this.retrieveGameData(this.players[1]),
      "image": this.imageProcessor.retrievePixelData(this._context),
      "done": this.gameFinished,
      "bot": this.bot,
      "trainingopponent": "false"
    }));
    this.gameFinished = false;
    this.aggregateReward = 0;
  }

  getTrainingOpponentMove(botSocket) {
    this.players[0].responseReceived = false;
    botSocket.send(JSON.stringify({
      "court": this.retrieveGameData(this.players[0]),
      "image": "dummy",
      "done": "dummy",
      "bot": this.trainingOpponent,
      "trainingopponent": "true"
    }));
  }

  retrieveGameData(player) {
    var bally = Math.round(this.ball.position.y);
    var paddley = player.position.y;
    var reward = this.aggregateReward;
    var court = `{"bally": ${bally}, "paddley": ${paddley}, "reward": ${reward}}`;
    return court;
  }

  draw() {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this.drawRectangle(this.ball);
    this.players.forEach(player => this.drawRectangle(player));
  }

  drawRectangle(rectangle) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
  }

  reset() {
    this.ball.resetPosition(this._canvas.width, this._canvas.height);
    this.players[0].resetPosition(this._canvas.height)
    this.players[1].resetPosition(this._canvas.height)
    this.isPointOver = false;

    if (this.players[0].score < 21 && this.players[1].score < 21) {
      this.ball.serve(this.serveSpeed);
    } 
    else {
      this.gameFinished = true;
      this.restartGame(); 
    }
  }

  restartGame() {
    this.players[1].score === 21 ? this.players[1].game++ : this.players[0].game++;
    this.players[0].score = 0;
    this.players[1].score = 0;
    this.ball.serve(this.serveSpeed);
  }

  updateReward() {
    if (this.isPointOver) {
      this.ball.velocity.x < 0 ? this.aggregateReward++: this.aggregateReward--;
    }
  }

  updateGame(deltatime) {
    this.ball.updatePosition(deltatime);
    this.ball.collideTop();
    this.ball.collideBottom(this._canvas.height);
    this.ball.collideLeftPaddle(this.players[0]);
    this.ball.collideRightPaddle(this.players[1], this._canvas.width);
    this.updateScore();
    
  }

  updateScore() {
    if (this.ball.isOutOfPlay(this._canvas.width)) {
      this.ball.velocity.x < 0 ? this.players[1].score++ : this.players[0].score++;
      this.isPointOver = true;
    }

    $("#player1tally").text(pong.players[0].score)
    $("#player2tally").text(pong.players[1].score)
    $("#player1-game-tally").text(pong.players[0].game)
    $("#player2-game-tally").text(pong.players[1].game)
  }
}

class Game {
  constructor(pong, botSocket) {
    this.pong = pong;
    this.botSocket = botSocket;
  }

  run() {
    this.botSocket.handleWebSocketResponse();
    this.botSocket.handleWebSocketClose();
    this.pong.run(this.botSocket);
    this.keyboard();
  }

  keyboard() {
    var pong = this.pong
    window.addEventListener('keydown', keyboardHandlerFunction);
    function keyboardHandlerFunction(e) {
      if (e.keyCode === 38) {
        pong.players[0].humanMove(pong._canvas.height, true);
      }
      if (e.keyCode === 40) {
        pong.players[0].humanMove(pong._canvas.height, false);
      } 
    }
  }
}

