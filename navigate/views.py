from django.shortcuts import render

from django.conf import settings

def hop(request, place=''):
    context = {
        'API_KEY': settings.API_KEY,
        'place': place,
    }

    # print(place)

    return render(request, 'navigate/hop.html', context)

def home(request):
    context = {
        'API_KEY': settings.API_KEY,
    }
    return render(request, 'navigate/home.html', context)