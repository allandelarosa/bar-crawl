from django.urls import path
from . import views

urlpatterns = [
    path('hop/', views.hop, name='navigate-hop'),
    path('', views.home, name='navigate-home'),
]
