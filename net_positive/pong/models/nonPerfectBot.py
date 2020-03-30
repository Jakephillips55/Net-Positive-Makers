from django.db import models
import numpy as np

class NonPerfectBot(models.Model):
    @classmethod
    def get_move(request, bally, paddley):
        sample = np.random.uniform()
        if int(bally) <= int(paddley):
            if sample >= 0.1:
                move_up = True
            else:
                move_up = False 
        else:
            if sample >= 0.1:
                move_up = False 
            else:
                move_up = True
        return move_up