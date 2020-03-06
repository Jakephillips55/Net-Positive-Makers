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
    paddley = request.GET.get('paddley')
    court = {'ballx': ballx, 'bally': bally, 'paddley': paddley}
    data = {
      'up': SimpleBot.simple_bot(court),
    }
    return JsonResponse(data)

def play(request):
    ballx = request.POST.get('ballx')
    bally = request.POST.get('bally')
    court = {'ballx ': ballx, 'bally ': bally }
    print(court)
    return HttpResponse(court)
