from rest_framework import serializers
from holder.models import Playground  # Ensure this import is correct
from .models import Notification
from .models import Booking, GoogleFitData


class PlaygroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playground
        fields = '__all__'  


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['ticket_number', 'playground', 'time_slot', 'date', 'num_players', 'status']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'is_read']

class GoogleFitDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoogleFitData
        fields = '__all__'  # Ensure all fields are included



