from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='pong-home'),
    path('play', views.play, name='pong-play'),
    path('bot', views.bot, name='pong-bot'),
    path('get_name', views.get_name, name='get_name')
]
