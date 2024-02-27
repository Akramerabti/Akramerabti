from django.shortcuts import render

# Create your views here.

import json 
from django.contrib.auth import authenticate, login, logout #imports functions for user auth
from django.contrib.auth.models import User
from django.http import JsonResponse #imports response class
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Board, Availability
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework import status, views 
from rest_framework.response import Response


@require_POST
@csrf_exempt
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail" : "Please provide username and password."})
    user = authenticate(username=username, password=password)
    if user is None :
        return JsonResponse({"detail" : "invalid credentials"}, status=400)
    
    login(request, user)
    return JsonResponse({"details" : "Successfully logged in!"})

@require_POST
@csrf_exempt
def signup_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail": "Please provide username and password."}, status=400)

    # Check if the username is already taken
    if User.objects.filter(username=username).exists():
        return JsonResponse({"detail": "Username is already taken."}, status=400)

    # Create a new user and log them in
    user = User.objects.create_user(username=username, password=password)
    login(request, user)
    return JsonResponse({"detail": "Successfully signed up!", "username": user.username})

@csrf_exempt
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"details" : "You are not logged in!"}, status=400)
    logout(request)
    return JsonResponse({"detail" : "Successfully logged out!"})

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    return JsonResponse({"isAuthenticated": True})

@csrf_exempt  
def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    return JsonResponse({"username" :request.user.username,"isAuthenticated": True})

class BoardViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing accounts.
    """
    queryset = Board.objects.all()
    serializer_class = BoardSerializer 

    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


    
class TaskViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing accounts.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


def find_best_times(user_a_avail, user_b_avail, duration):
    potential_slots = []
    for slot_a in user_a_avail:
        for slot_b in user_b_avail:
            if slot_a.overlaps(slot_b) and slot_a.duration() >= duration:
                potential_slots.append(slot_a.start_time) 
    return potential_slots[:5]  # Limit to top 5
    
@csrf_exempt
class EventListCreateView(APIView):

    def __init__(self, *args, **kwargs):
        print("EventListCreateView __init__ called with:", args, kwargs)
        super().__init__(*args, **kwargs)

    # GET /api/scheduler - List all events
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    # POST /api/scheduler - Create a new event
    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
class EventDetailUpdateDeleteView(APIView):
    # GET /api/scheduler/<event_id> - Get an event
    def get(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    # PUT /api/scheduler/<event_id> - Update an event
    def put(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /api/scheduler/<event_id> - Delete an event
    def delete(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)