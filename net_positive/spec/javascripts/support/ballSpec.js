"use strict";

describe('Ball', function() {
  var ballWidth = 4;
  var ballHeight = 8;
  var ball;

  beforeEach(function() {
    
    ball = new Ball(ballWidth, ballHeight)
  })

  describe("initialize", function() {
    it("renders in the correct size", function() {
      expect(ball.size.x).toEqual(4)
      expect(ball.size.y).toEqual(8)
    })
  })

  describe("isOutOfPlay", function() {
    it("returns true if ball is past left side of court", function() {
      ball.position.x = 1;
      expect(ball.isOutOfPlay(320)).toEqual(true);
    })

    it("returns true if ball is past right side of court", function() {
      ball.position.x = 319;
      expect(ball.isOutOfPlay(320)).toEqual(true);
    })
    
    it("returns false if ball is in the court", function() {
      ball.position.x = 2;
      expect(ball.isOutOfPlay(320)).toEqual(false);
    })
  })
});