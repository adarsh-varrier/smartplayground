# your_app_name/serializers.py
from rest_framework import serializers
from .models import CustomUser

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, smart_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'user_type', 'location', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        password = validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)  # Set the password properly
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)  # password field is write-only


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get("email")

        if not email:
            raise serializers.ValidationError({"email": "Email field is required."})  # ✅ Debugging

        if not CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "User with this email does not exist."})  # ✅ Debugging

        print(f"Email {email} exists in the database.")  # ✅ Debugging
        return attrs