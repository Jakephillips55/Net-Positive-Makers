class Game {
  constructor(pong) {
    this.pong = pong;
    this.playerVsAi = true;
    this.playerVsPlayer = false;
    this.player1Mouse = false;
    this.player2Mouse = false;
  }
  controls() {
    if (this.playerVsAi && this.player1Mouse) {
      this.mouse(0);
      // bot
    }
    else if (this.playerVsAi) {
      this.keyboard(0);
      // bot
    }
    else if (this.playerVsPlayer && this.player2Mouse) {
      this.mouse(1);
      this.keyboard(0);
    }
    else if (this.playerVsPlayer && this.player1Mouse) {
      this.mouse(0);
      this.keyboard(1);
    }
    else if (this.playerVsPlayer) {
      this.keyboardPlayerPlayer();
      this.keyboard(1);
    }
  }
  mouse(player) {
    canvas.addEventListener('mousemove', event => {
      pong.players[player].position.y = event.offsetY;
    });
  }
  keyboard(player) {
    window.addEventListener('keydown', keyboardHandlerFunction);
    function keyboardHandlerFunction(e) {
      if (e.keyCode === 40 && pong.players[player].position.y < (pong._canvas.height - 50)) {
        pong.players[player].position.y += 25;
      }
      else if (e.keyCode === 38 && pong.players[player].position.y > 50) {
        pong.players[player].position.y -= 25;
      }
      else if (e.keyCode === 32) {
        pong.start();
      }
    }
  }
  keyboardPlayerPlayer() {
    window.addEventListener('keydown', keyboardHandlerFunction);
    function keyboardHandlerFunction(e) {
      if (e.keyCode === 83 && pong.players[0].position.y < (pong._canvas.height - 50)) {
        pong.players[0].position.y += 25;
      }
      else if (e.keyCode === 87 && pong.players[0].position.y > 50) {
        pong.players[0].position.y -= 25;
      }
    }
  }
}
const game = new Game(pong);
game.controls();
