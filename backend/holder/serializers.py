from rest_framework import serializers
from holder.models import Playground  # Ensure this import is correct
from .models import Booking


class PlaygroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playground
        fields = '__all__'  


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['ticket_number', 'playground', 'time_slot', 'date', 'num_players', 'status']

