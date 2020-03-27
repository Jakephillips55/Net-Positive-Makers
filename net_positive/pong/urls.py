from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='pong-home'),
    path('multiplayer/', views.multiplayer, name='pong-tour'),
    path('<str:training_session>/', views.wsbot, name='wsbot'),
]