from django.urls import path
from . import views

urlpatterns = [
    path('', views.arcade, name='arcade'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
    path('<str:training_session>/', views.training, name='training'),
]