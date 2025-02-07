# your_app_name/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('Owner', 'Owner'),
        ('Customer', 'Customer'),
    ]
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    location = models.CharField(max_length=255, blank=True, null=True)  # Location from map

    def __str__(self):
        return self.username
