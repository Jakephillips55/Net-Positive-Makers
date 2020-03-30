from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import PerfectBot
from pong.models import NonPerfectBot
from pong.models import AndrejBot
from pong.models import AndrejBotBallOnly
from pong.models import AndrejBotTraining
from pong.models import FaultyBot
from pong.models import Junior

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        court_json = json.loads(text_data)["court"]
        bot = json.loads(text_data)["bot"]
        trainingopponent = json.loads(text_data)["trainingopponent"]
        
        if trainingopponent == "true":
          self.trainingOpponent(court_json)
        else:
          if bot == "student":
            self.student(court_json, text_data)

          if bot == "steffi-graph":
            self.steffiGraph(court_json)
          
          if bot == "nodevak-djokovic":
            self.nodevakDjokovic(court_json)

          if bot == "rl-federer":
            self.rlFederer(text_data)
          
          if bot == "andrai-agassi":
            self.andraiAgassi(court_json)

          if bot == "bjorn-cyborg":
            self.bjornCyborg(text_data)
      
    def trainingOpponent(self, court_json):
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        move_up = NonPerfectBot.non_perfect_bot_ws(bally, paddley)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 0
        }))

    def student(self, text_data):
        done = json.loads(text_data)["done"]
        reward = json.loads(text_data)["reward"]
        image = json.loads(text_data)["image"]
        image = self.reverseStringCompression(image)
        image = list(image)
        move_up = AndrejBotTraining.andrej_training(image, reward, done)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 1
        }))

    def steffiGraph(self, court_json):
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        move_up = PerfectBot.perfect_bot_ws(bally, paddley)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 1
        }))

    def nodevakDjokovic(self, court_json):
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        move_up = NonPerfectBot.non_perfect_bot_ws(bally, paddley)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 1
        }))

    def rlFederer(self, text_data):
        image = json.loads(text_data)["image"]
        image = self.reverseStringCompression(image)
        image = list(image)
        move_up = AndrejBot.andrej_bot(image)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 1 
        }))

    def andraiAgassi(self, court_json):
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        move_up = FaultyBot.faulty_bot_ws(bally, paddley)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 1 
        }))

    def bjornCyborg(self, text_data):
        image = json.loads(text_data)["image"]
        image = self.reverseStringCompression(image)
        image = list(image)
        move_up = Junior.junior_bot(image)
        self.send(text_data=json.dumps({
          'moveup': move_up,
          'playerID': 1 
        }))

    def reverseStringCompression (self, image):
        image = image.replace('v', 'wwwwwwwwwwwwwwwwwwww')
        image = image.replace('w', '00000000000000000000000000000000000000000000000000000000000000000000000000000000')
        image = image.replace('x', '0000000000000000000000000000000000000000')
        image = image.replace('y', '00000000000000000000')
        image = image.replace('z', '0000000000')
        image = image.replace('a', '1111')
        return image



        
        
          
        

