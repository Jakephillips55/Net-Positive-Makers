from django.db import models

class SimpleBot(models.Model):
    @classmethod
    def simple_bot(request, court):
        print(court)
        if int(court["bally"]) <= int(court["paddley"]):
            print(True)
            return True
        else:
            print(False)
            return False

    def other_bot(request):
        return '1'
