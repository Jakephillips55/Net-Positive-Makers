from django.test import TestCase
from django.http import JsonResponse
from django.views.generic import TemplateView
from pong.models import perfectBot
from pong.models import nonPerfectBot
from pong.models import faultyBot

class perfectBotTestCase(TestCase):
    def moves_up(self):
        """perfect bot moves up when below the ball"""
        self.assertEqual(PerfectBot.perfect_bot_ws(), 'The lion says "roar"')
        self.assertEqual(cat.speak(), 'The cat says "meow"')



if __name__ == "__main__":
      HomeView()
      SearchFormTestCase()
  # test_make_move()
print("Everything passed")
