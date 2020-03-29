"use strict";

describe('Pong', function() {
  var testCanvas;
  var imageProcessor;
  var ball;
  var paddleWidth = 8;
  var paddleHeight = 32;
  var paddleOffsetStart = 36;
  var player1;
  var player2;
  var pong;
  
      
  beforeEach(function() {
    testCanvas = document.createElement('canvas');
    spyOn(testCanvas, 'getContext').and.returnValue('testcontext');
    spyOnProperty(testCanvas, 'width', 'get').and.returnValue(320);
    spyOnProperty(testCanvas, 'height', 'get').and.returnValue(320);
    imageProcessor = 'testImageProcessor';
    ball = 'testBall';
    player1 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    player2 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    pong = new Pong(testCanvas, imageProcessor, ball, player1, player2);
  })

  describe("setPaddlesInitially", function() {
    it("renders the players in the correct x position", function() {
      pong.setPaddlesInitially();
      expect(pong.players[0].position.x).toEqual(36);
      expect(pong.players[1].position.x).toEqual(284);
    })

    it("renders the players in the correct y position", function() {
      pong.setPaddlesInitially();
      expect(pong.players[0].position.y).toEqual(160);
      expect(pong.players[1].position.y).toEqual(160);
    })
  })
});