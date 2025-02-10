from rest_framework import serializers
from holder.models import Playground  # Ensure this import is correct

class PlaygroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playground
        fields = '__all__'  # Include relevant fields
