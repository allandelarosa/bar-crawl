from django.urls import path
from . import views

urlpatterns = [
    path('crawl/', views.crawl, name='navigate-crawl'),
    path('crawl/<str:place>', views.crawl),
    path('', views.home, name='navigate-home'),
]
