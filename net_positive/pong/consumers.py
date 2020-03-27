from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import PerfectBot
from pong.models import NonPerfectBot
from pong.models import AndrejBot
from pong.models import AndrejBotBallOnly
from pong.models import AndrejBotTraining
from pong.models import FaultyBot
from pong.models import Junior
from datetime import datetime
import numpy as np

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass


    def receive(self, text_data):
        
        court_json = json.loads(text_data)["court"]
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        reward = json.loads(court_json)["reward"]
        done = json.loads(text_data)["done"]
        bot = json.loads(text_data)["bot"]
        trainingopponent = json.loads(text_data)["trainingopponent"]
        image = json.loads(text_data)["image"]
        image = image.replace('v', 'wwwwwwwwwwwwwwwwwwww')
        image = image.replace('w', '00000000000000000000000000000000000000000000000000000000000000000000000000000000')
        image = image.replace('x', '0000000000000000000000000000000000000000')
        image = image.replace('y', '00000000000000000000')
        image = image.replace('z', '0000000000')
        image = image.replace('a', '1111')
        image = list(image)
        
        if trainingopponent == "true":
          move = NonPerfectBot.non_perfect_bot_ws(bally, paddley)
          self.send(text_data=json.dumps({
          'move': move,
          'playerID': 0
          }))
        else:
          if bot == "student":
            move = AndrejBotTraining.andrej_training(image, reward, done)
            self.send(text_data=json.dumps({
            'move': move,
            'playerID': 1
            }))

          if bot == "steffi-graph":
            move = PerfectBot.perfect_bot_ws(bally, paddley)
            self.send(text_data=json.dumps({
            'move': move,
            'playerID': 1
            }))
          
          if bot == "nodevak-djokovic":
            move = NonPerfectBot.non_perfect_bot_ws(bally, paddley)
            self.send(text_data=json.dumps({
            'move': move,
            'playerID': 1
          }))

          if bot == "rl-federer":
            move = AndrejBot.andrej_bot(image)
            self.send(text_data=json.dumps({
            'move': move,
            'playerID': 1 
            }))
          
          if bot == "andrai-agassi":
            move = FaultyBot.faulty_bot_ws(bally, paddley)
            self.send(text_data=json.dumps({
            'move': move,
            'playerID': 1 
            }))

          if bot == "bjorn-cyborg":
            move = Junior.junior_bot(image)
            self.send(text_data=json.dumps({
            'move': move,
            'playerID': 1 
          }))


        
        
          
        

