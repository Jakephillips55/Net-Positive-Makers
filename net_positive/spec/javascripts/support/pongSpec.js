"use strict";

describe('Pong', function() {
  var pong;
  var testCanvas;
  var ball;
  var player;        


  beforeEach(function() {
   
    testCanvas = document.createElement('canvas')
    testCanvas.width = 320
    testCanvas.height = 320
    testCanvas.id = 'pong'
  
    pong = new Pong(testCanvas);
    ball = new Ball(4,8)
    player = new Player(8,32,36)
  })

  describe("canvas dimensions", function() {
    it("draws the correct height", function() {
      expect(pong._canvas.height).toEqual(320)
    })
    it("draws the correct width", function() {
      expect(pong._canvas.width).toEqual(320)
    })
  })

  describe("ball", function() {
    it("renders in the correct size", function() {
      expect(ball.size.x).toEqual(4)
      expect(ball.size.y).toEqual(8)
    })
  })

  describe("player", function() {
    it("it renders in the correct size", function() {
      expect(player.size.x).toEqual(8)
      expect(player.size.y).toEqual(32)
    })

    it("renders the players in the correct x position", function() {
      expect(pong.players[0].position.x).toEqual(36)
      expect(pong.players[1].position.x).toEqual(284)
    })

    it("renders the players in the correct y position", function() {
      expect(pong.players[0].position.y).toEqual(160)
      expect(pong.players[1].position.y).toEqual(160)
    })
  })
});