"use strict";

describe('botSocket', function() {
  var testCanvas; 
  var pong;
  var botSocket;
  
  beforeEach(function() {
    testCanvas = document.createElement('canvas')
    testCanvas.width = 320
    testCanvas.height = 320
    testCanvas.id = 'pong'
    pong = new Pong(testCanvas);
    botSocket = new BotSocket(pong, 'ws://testurl:8000');
    spyOn(pong.players[0], "storeMove");
    spyOn(pong.players[1], "storeMove");
  })

  describe("parseAndStore", function() {
    it("stores moveup true against first player", function() {
      var response = JSON.stringify({
        'moveup': true,
        'playerID': 0
      })
      botSocket.parseAndStore(response);
      expect(pong.players[0].storeMove).toHaveBeenCalledWith(true);
    })

    it("stores moveup true against second player", function() {
      var response = JSON.stringify({
        'moveup': true,
        'playerID': 1
      })
      botSocket.parseAndStore(response);
      expect(pong.players[1].storeMove).toHaveBeenCalledWith(true);
    })

    it("stores moveup false against first player", function() {
      var response = JSON.stringify({
        'moveup': false,
        'playerID': 0
      })
      botSocket.parseAndStore(response);
      expect(pong.players[0].storeMove).toHaveBeenCalledWith(false);
    })

    it("stores moveup false against second player", function() {
      var response = JSON.stringify({
        'moveup': false,
        'playerID': 1
      })
      botSocket.parseAndStore(response);
      expect(pong.players[1].storeMove).toHaveBeenCalledWith(false);
    })
  })
});