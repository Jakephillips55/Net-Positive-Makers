from django.db import models

class FaultyBot(models.Model):
    @classmethod
    def get_move(request, bally, paddley):
        if str(bally) <= str(paddley):
            return True
        else:
            return False