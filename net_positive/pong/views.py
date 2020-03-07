from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.http import JsonResponse
from pong.models import SimpleBot
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect
from .forms import NameForm

def home(request, template='index.html'):
    axis = HttpResponse(play(request))
    return render(request, template, {})

def bot(request):
    bally = request.data('bally')
    paddley = request.data('paddley')
    court = {'bally': bally, 'paddley': paddley}
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
      # 'ballx': SimpleBot.simple_bot(court),
      'bally': SimpleBot.other_bot(request)
    }
    return JsonResponse(data)

def get_name(request):
    if request.method == 'POST':
        form = NameForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect(request, '/thanks/')
        else:
            form = NameForm()

            return render(request, 'index.html' , {'form': form})
