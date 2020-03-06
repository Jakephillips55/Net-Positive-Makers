from django.db import models

class SimpleBot(models.Model):

    @classmethod
    def simple_bot(request, court):
        return court["bally"] > court["paddley"]

    @classmethod
    def post_bot(request, court):
        return court['ballx']
