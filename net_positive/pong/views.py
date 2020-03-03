from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse(
'<!DOCTYPE html><html lang="en"><head><title>Pong</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><h1>Pong</h1><canvas id="pong" width="600" height="400"></canvas><script src="static/pong.js"></script></body>')

def play(request):
    return HttpResponse('<h1> Pong Play </h3>')