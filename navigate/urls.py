from django.urls import path
from . import views

urlpatterns = [
    path('hop/', views.hop, name='navigate-hop'),
    path('hop/<str:place>', views.hop),
    path('', views.home, name='navigate-home'),
]
