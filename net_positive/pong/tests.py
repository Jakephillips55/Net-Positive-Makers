from django.test import TestCase
from pong.models import SimpleBot
from django.http import JsonResponse
# Create your tests here.
from django.views.generic import TemplateView

class YourTestClass(TestCase):
    def setUp(self):
        # Setup run before every test method.
        pass

    def tearDown(self):
        # Clean up run after every test method.
        pass

    def test_something_that_will_pass(self):
        self.assertFalse(False)

    def test_something_that_will_fail(self):
        self.assertTrue(False)

if __name__ == "__main__":
      TestClass();
  # test_make_move()
print("Everything passed")
