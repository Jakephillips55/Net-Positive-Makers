from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from pong.models import SimpleBot

def home(request):
    return HttpResponse(
'<!DOCTYPE html><html lang="en"><head><title>Pong</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body onload="startBall()"><h1 style="osition:absolute;left:45%;top:10px;font-size:70px;"<h1>Pong</h1><h1 style=”position:absolute;left:30px;top:80px;”>Player: <span id="score1">0</span></h1><h1 style=”position:absolute;right:30px;top:80px;”>A.I: <span id="score2">0</span></h1><hr style="margin-top:150px;"><canvas id="pong" width="600" height="400"></canvas><script src="static/pong.js"></script></body>')

def bot(request):

    data = {
      'up': SimpleBot.simple_bot(),
    }
    return JsonResponse(data)

def play(request):
    return HttpResponse('<h1> Pong Play </h3>')
