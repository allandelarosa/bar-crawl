from django.urls import path
from . import views

urlpatterns = [
    path('path/', views.path, name='djikstra-path'),
    path('graph/', views.graph, name='djikstra-graph'),
]
