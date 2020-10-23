from django.urls import path
from . import views

urlpatterns = [
    path('hop', views.hop, name='navigate-hop'),
    path('', views.home, name='navigate-home'),
    path('test', views.test, name='navigate-test'),
    path('djikstra', views.djikstra, name='navigate-djikstra'),
    path('graph', views.construct_graph, name='navigate-graph'),
]
