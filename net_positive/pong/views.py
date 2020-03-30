from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse


def arcade(request, template='arcade.html'):
  return render(request, template, {})

def multiplayer(request, template='multiplayer.html'):
  return render(request, template, {})

def training(request, training_session):
  return render(request, 'training.html', {
    'training_session': training_session,
  })

