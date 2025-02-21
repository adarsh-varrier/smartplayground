# holder/models.py
import random
import string
from django.db import models
from smartplay.models import CustomUser
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Create your models here.
class Playground(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)  # Store Latitude
    longitude = models.FloatField(null=True, blank=True)  # Store Longitude
    address = models.TextField()
    time_slot_start = models.TimeField()
    time_slot_end = models.TimeField()
    num_players = models.IntegerField()
    
    PLATFORM_CHOICES = [
        ('football', 'Football Ground'),
        ('cricket', 'Cricket Ground'),
        ('park', 'Children’s Park'),
    ]
    platform_type = models.CharField(max_length=20, choices=PLATFORM_CHOICES)

    image = models.ImageField(upload_to='playground_images/', null=True, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)  # Adjust the max_digits and decimal_places as needed
    
    # Add ForeignKey to connect Playground with Owner (CustomUser)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='playgrounds')

    def save(self, *args, **kwargs):
        if self.location and (not self.latitude or not self.longitude):
            geolocator = Nominatim(user_agent="geoapi")
            try:
                location = geolocator.geocode(self.location, timeout=10)
                if location:
                    self.latitude = location.latitude
                    self.longitude = location.longitude
            except GeocoderTimedOut:
                pass  # Prevent API timeout crashes
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="bookings")
    playground = models.ForeignKey("Playground", on_delete=models.CASCADE, related_name="bookings")
    ticket_number = models.CharField(max_length=7, unique=True, editable=False, blank=True)
    time_slot = models.TimeField()
    date = models.DateField()
    num_players = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def generate_ticket_number(self):
        """
        Generate a random 5-digit number followed by 2 random uppercase letters.
        Example: 12345AB
        """
        digits = "".join(random.choices(string.digits, k=5))
        letters = "".join(random.choices(string.ascii_uppercase, k=2))
        return f"{digits}{letters}"

    def save(self, *args, **kwargs):
        if not self.ticket_number:  # Generate only if not already set
            self.ticket_number = self.generate_ticket_number()
            while Booking.objects.filter(ticket_number=self.ticket_number).exists():
                self.ticket_number = self.generate_ticket_number()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.ticket_number} - {self.user.username} at {self.playground.name}"
    

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"
    

