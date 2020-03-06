from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from pong.models import SimpleBot

def home(request, template='index.html'):
    axis = HttpResponse(play(request))
    return render(request, template, {})

def bot(request):
    ballx = request.GET.get('ballx')
    bally = request.GET.get('bally')
    paddely = request.GET.get('paddely')
    court = {'ballx': ballx, 'bally': bally}
    data = {
      'bally': SimpleBot.simple_bot(court),
    }
    return JsonResponse(data)

def play(request):
    ballx = request.POST.get('ballx')
    bally = request.POST.get('bally')
    court = {'ballx ': ballx, ' bally ': bally }
    print(court)
    data = {
      'ballx': SimpleBot.post_bot(court),
      'bally': 'hello'
    }
    return JsonResponse(data)
