"use strict";

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

