from django.db import models

class FaultyBot(models.Model):
    @classmethod
    def faulty_bot_ws(request, bally, paddley):
        if str(bally) <= str(paddley):
            return True
        else:
            return False