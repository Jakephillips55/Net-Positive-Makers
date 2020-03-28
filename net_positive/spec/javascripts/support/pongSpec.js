"use strict";

describe('Pong', function() {
  var testCanvas;  
  var pong;
      
  beforeEach(function() {
    testCanvas = document.createElement('canvas')
    testCanvas.width = 320
    testCanvas.height = 320
    testCanvas.id = 'pong'
    pong = new Pong(testCanvas);
  })

  describe("canvas dimensions", function() {
    it("draws the correct height", function() {
      expect(pong._canvas.height).toEqual(320)
    })
    it("draws the correct width", function() {
      expect(pong._canvas.width).toEqual(320)
    })
  })

  describe("sets player starting position", function() {
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