from django.db import models

class SimpleBot(models.Model):

    def simple_bot(request, court):
        return court['bally'] > court['paddely']

    def post_bot(request):
        return '1'
