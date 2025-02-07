# views.py
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework.decorators import api_view
from django.contrib.auth import logout
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from .utils.weather import get_weather_data, get_future_weather_data


def test_view(request):
    msg='Hello from the backend!'
    return JsonResponse({'message': msg})

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully', 'success': True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)  # Generate token

            response_data = {
                "message": "Logged in successfully",
                "token": token.key,
                "user_type": "Admin" if user.is_superuser else user.user_type,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request):
        logout(request)  # This logs the user out
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK) 

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user = request.user  # Get the current logged-in user
        return Response({
            'username': user.username,
        })

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings(request):
    user = request.user
    
    if request.method == 'GET':
        return Response({
            "username": user.username,
            "email": user.email,
            "location": user.location or "Not provided",
            "user_type": user.user_type,
        })
    
    elif request.method == 'PUT':
        data = request.data
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.location = data.get('location', user.location)
        
        password = data.get('password')
        if password:
            user.set_password(password)  # Update password
        
        user.save()
        
        return Response({
            "username": user.username,
            "email": user.email,
            "location": user.location or "Not provided",
            "user_type": user.user_type,
        }, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def get_user_weather(request):
    user = request.user
    location = user.location  # Get location from the logged-in user

    if location:
        weather_data = get_weather_data(location)
        if weather_data and 'sys' in weather_data and 'country' in weather_data['sys']:
            future_weather_data = get_future_weather_data(location)
            return Response({
                "current_weather": weather_data,
                "next_48_hour_forecast": future_weather_data,
                "message": "Weather data fetched successfully"
            })
        else:
            return Response({"error": "Could not fetch weather data."}, status=500)
    else:
        return Response({"error": "Location is not set for this user."}, status=400)