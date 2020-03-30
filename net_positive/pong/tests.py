from django.test import TestCase
from django.http import JsonResponse
from django.views.generic import TemplateView
from pong.models import PerfectBot
from pong.models import NonPerfectBot
from pong.models import FaultyBot

class perfectBotTestCase(TestCase):
    def test_moves_up_correctly(self):
        """perfect bot moves up when below the ball"""
        self.assertEqual(PerfectBot.perfect_bot_ws('10', '30'), true)

if __name__ == "__main__":
      HomeView()
      SearchFormTestCase()
  # test_make_move()
print("Everything passed")
