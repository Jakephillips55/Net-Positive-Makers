"use strict";

describe('Pong', function() {
  var pong;
  var testCanvas;
  var ball;
  var player;        


  beforeEach(function() {
   
    testCanvas = document.createElement('canvas')
    testCanvas.width = 150
    testCanvas.height = 150
    testCanvas.id = 'pong'
  
    pong = new Pong(testCanvas);
    ball = new Ball()
    player = new Player()
  })

  describe("canvas dimensions", function() {
    it("draws the correct height", function() {
      expect(pong._canvas.height).toEqual(150)
    })
    it("draws the correct width", function() {
      expect(pong._canvas.width).toEqual(150)
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
      player = new Player()
      expect(player.size.x).toEqual(8)
      expect(player.size.y).toEqual(32)
    })

    it("renders the players in the correct x position", function() {
      expect(pong.players[0].position.x).toEqual(36)
      expect(pong.players[1].position.x).toEqual(114)
    })

    it("renders the players in the correct y position", function() {
      expect(pong.players[0].position.y).toEqual(75)
      expect(pong.players[1].position.y).toEqual(75)
    })
  })
  
  describe("getMove", function() {
   it("should communicate data with XHR request", function() {

    var xhr = {

       open: jasmine.createSpy('open')
   };

   XMLHttpRequest = jasmine.createSpy('XMLHttpRequest');
   XMLHttpRequest.and.callFake(function () {
       return xhr;

   });

   submit();

   expect(xhr.open).toHaveBeenCalled(); 
    })
  })

  describe('Player', function() { 

    beforeEach(function() {
        player = new Player(); 
    }); 

    it('starts at score count of 0', function(){
        expect(player.score).toEqual(0); 
    }); 

    it('starts at game count of 0', function(){
      expect(player.game).toEqual(0); 
    }); 

  });
})
