from django.shortcuts import render
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

# it is the end points

class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class =  RoomSerializer
      