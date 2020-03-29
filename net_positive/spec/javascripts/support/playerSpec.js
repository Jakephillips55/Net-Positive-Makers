"use strict";

describe('Player', function() {
  var player;        

  beforeEach(function() {
    player = new Player(8,32,36)
  })

  describe("initialize", function() {
    it("it renders in the correct size", function() {
      expect(player.size.x).toEqual(8)
      expect(player.size.y).toEqual(32)
    })
  })
});