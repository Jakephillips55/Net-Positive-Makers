"use strict";

describe('Ball', function() {
  var ball;


  beforeEach(function() {
    ball = new Ball(4,8)
  })

  describe("initialize", function() {
    it("renders in the correct size", function() {
      expect(ball.size.x).toEqual(4)
      expect(ball.size.y).toEqual(8)
    })
  })
});