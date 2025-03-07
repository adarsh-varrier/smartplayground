from rest_framework import serializers
from holder.models import Playground
from smartplay.models import CustomUser
from .models import AppRating, Review

class PlaygroundSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()  # Fetch owner's name manually

    class Meta:
        model = Playground
        fields = ['id', 'name', 'location', 'latitude', 'longitude', 'platform_type', 'price', 'owner_name']

    def get_owner_name(self, obj):
        # Fetch owner instance using the ID from the Playground model
        owner = CustomUser.objects.filter(id=obj.owner_id).first()
        return owner.username if owner else "Unknown Owner"
    
class AppRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppRating
        fields = ['id', 'user', 'rating', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Display username instead of ID
    playground = serializers.StringRelatedField(read_only=True)  # Display playground name instead of ID

    class Meta:
        model = Review
        fields = ['id', 'playground', 'user', 'rating', 'comment', 'created_at']
