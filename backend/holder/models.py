from django.db import models
from smartplay.models import CustomUser

# Create your models here.
class Playground(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
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

    def __str__(self):
        return self.name