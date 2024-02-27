from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.conf import settings

STATUS = (
    ("Done","Done"),
    ("ToDo","To Do"),
    ("Doing","Doing"),
)

User = get_user_model()

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)  
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='kanban_users',  # Custom reverse name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='kanban_user_permissions',  # Custom reverse name
        blank=True
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

class Board(models.Model):
    name = models.CharField(max_length=250)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name="boards")

class Column(models.Model):
    name = models.CharField(max_length=250)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="columns")
    #owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name="columns")


class Task(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank = True)
    status = models.CharField(max_length=250, choices=STATUS)
    parent = models.ForeignKey("Task",on_delete=models.CASCADE,related_name="subtasks", null = True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name="tasks")
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="tasks")
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name="tasks")

class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()  # Use DateTimeField for flexibility
    type = models.CharField(max_length=50, choices=[  
        ('Appointment', 'Appointment'),
        ('Meeting', 'Meeting'),
        ('Reminder', 'Reminder') 
    ])
    archived = models.BooleanField(default=False)
    
class Availability(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()