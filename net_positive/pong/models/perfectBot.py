from django.db import models

class PerfectBot(models.Model):
    @classmethod
    def perfect_bot_ws(request, bally, paddley):
        if int(bally) <= int(paddley):
            move_up = True
        else:
            move_up = False 
        return move_up