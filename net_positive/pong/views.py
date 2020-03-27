from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse


def home(request, template='index.html'):
  return render(request, template, {})

def multiplayer(request, template='multiplayer.html'):
    return render(request, template, {})

def wsbot(request, training_session):
  return render(request, 'pong/wsbot.html', {
        'training_session': training_session,
    })

