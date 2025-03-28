# owner/views.py
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Playground, Booking
from holder.serializers import PlaygroundSerializer, BookingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.utils.dateparse import parse_date, parse_time
from datetime import datetime, timedelta
from smartplay.utils.weather import get_weather_data, get_future_weather_data
from .models import Notification
from .serializers import NotificationSerializer
from smartplay.models import CustomUser
from backend.google_fit_api import fetch_all_google_fit_data, google_fit_sign_out
from django.utils import timezone

from django.http import JsonResponse
from django.views import View
from .models import Playground
import requests


# API view to register a new Playground
class PlaygroundRegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Ensure the user is an 'Owner'
        if request.user.user_type != 'Owner':
            return Response({"detail": "Only owners can register playgrounds."}, status=status.HTTP_403_FORBIDDEN)

        # Create a new Playground object
        data = request.data
        data['owner'] = request.user.id  # Automatically associate logged-in user as owner

        serializer = PlaygroundSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OwnerPlaygroundsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure only owners can access this view
        if not hasattr(request.user, 'user_type') or request.user.user_type.lower() != 'owner':
            return Response({"detail": "Only owners can access their playgrounds."}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Fetch playgrounds for the logged-in owner
            playgrounds = Playground.objects.filter(owner=request.user)

            if not playgrounds.exists():
                return Response({"detail": "No playgrounds found for this owner."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the playground data
            serializer = PlaygroundSerializer(playgrounds, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log or return a more descriptive error message
            return Response({"detail": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PlaygroundDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads

    def get(self, request, id):
        playground = get_object_or_404(Playground, id=id)
        serializer = PlaygroundSerializer(playground)
        return Response(serializer.data)
    
    def put(self, request, id):
        playground = get_object_or_404(Playground, id=id)

        if playground.owner != request.user:
            return Response(
                {"error": "You do not have permission to update this playground."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()

        # Keep the old image if no new image is uploaded
        if "image" not in data or data["image"] == "undefined":
            data["image"] = playground.image  # Retain existing image

        serializer = PlaygroundSerializer(playground, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def delete(self, request, id):
        # Get the playground object
        playground = get_object_or_404(Playground, id=id)

        if playground.owner != request.user:
            return Response({"error": "You do not have permission to delete this playground."},
                             status=status.HTTP_403_FORBIDDEN)

        playground.delete()
        return Response({"message": "Playground deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class PlaygroundCustomerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure only customers can access this view
        if not hasattr(request.user, 'user_type') or request.user.user_type.lower() != 'customer':
            return Response({"detail": "Only customers can access playgrounds."}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Fetch playgrounds based on custom conditions
            # For example, all playgrounds that are available for customers
            playgrounds = Playground.objects.all()  # You can modify this filter as needed

            # Alternatively, if there are booking records, you can filter based on those
            # playgrounds = Playground.objects.filter(is_available=True)

            if not playgrounds.exists():
                return Response({"detail": "No playgrounds found for this customer."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the playground data
            serializer = PlaygroundSerializer(playgrounds, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Log or return a more descriptive error message
            return Response({"detail": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlaygroundDetailView2(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            playground = Playground.objects.get(id=id)
            serializer = PlaygroundSerializer(playground)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Playground.DoesNotExist:
            return Response({"detail": "Playground not found."}, status=status.HTTP_404_NOT_FOUND)
        


def delete_expired_bookings():
    """
    Delete bookings with a date older than the current date.
    """
    current_date = timezone.now().date()
    expired_bookings = Booking.objects.filter(date__lt=current_date)
    count = expired_bookings.count()
    expired_bookings.delete()
    print(f"Deleted {count} expired bookings.")

class BookPlayground(APIView):
    permission_classes = [IsAuthenticated]  # Requires authentication

    def post(self, request, playground_id):
        """
        Create a booking for a specific playground.
        """

        # Clean up expired bookings before processing the new booking
        delete_expired_bookings()

        user = request.user
        playground = get_object_or_404(Playground, id=playground_id)

        date = request.data.get("date")
        time_slot = request.data.get("time_slot")
        num_players = request.data.get("num_players")

        print(f"Received booking request from {user.username}: date={date}, time_slot={time_slot}, num_players={num_players}")

        if not date or not time_slot or not num_players:
            print("Error: Missing required fields")
            return Response({"error": "Missing required fields"}, status=400)

        try:
            num_players = int(num_players)
        except ValueError:
            print("Error: Invalid number of players")
            return Response({"error": "Invalid number of players"}, status=400)

        # Fetch existing bookings for the same date
        existing_bookings = Booking.objects.filter(playground=playground, date=date, time_slot=time_slot)
        total_players = sum(booking.num_players for booking in existing_bookings)

        print(f"Existing bookings count: {existing_bookings.count()}, Total players booked: {total_players}")

        # Check if the total player count is exceeded
        if total_players + num_players > playground.num_players:
            print("Error: Player limit exceeded")
            return Response({"error": "Player limit exceeded"}, status=400)

        # Check if the time slot is already booked
        if existing_bookings.filter(time_slot=time_slot).exists():
            print(f"Error: Time slot {time_slot} on {date} is already booked.")
            return Response({"error": "Time slot not available"}, status=400)

        # Create a new booking
        booking = Booking.objects.create(
            user=user,
            playground=playground,
            time_slot=time_slot,
            date=date,
            num_players=num_players
        )

        print(f"Booking successful: Ticket Number {booking.ticket_number}")
        
        return Response({
            "message": "Booking successful",
            "ticket_number": str(booking.ticket_number),
        }, status=201)

class BookedSlotsView(APIView):
    def get(self, request, playground_id):
        try:
            playground = Playground.objects.get(id=playground_id)
        except Playground.DoesNotExist:
            return Response({"error": "Playground not found"}, status=status.HTTP_404_NOT_FOUND)
        
        bookings = Booking.objects.filter(playground_id=playground_id)
        booked_slots = [booking.time_slot for booking in bookings]
        return Response(booked_slots, status=status.HTTP_200_OK)
    
class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f"Authenticated User ID: {user.id}")  # Debugging

        bookings = Booking.objects.filter(user_id=user.id).select_related('playground')  
        
        if not bookings.exists():
            return Response({"error": "No bookings found for this user"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize bookings and include playground names
        serialized_data = []
        for booking in bookings:
            serialized_data.append({
                "ticket_number": booking.ticket_number,
                "playground": booking.playground.name,  # Fetching playground name instead of ID
                "time_slot": booking.time_slot,
                "date": booking.date,
                "num_players": booking.num_players,
                "status": booking.status,
            })

        return Response(serialized_data, status=status.HTTP_200_OK)
    
class OwnerBookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f"Authenticated Owner ID: {user.id}")  # Debugging

        # Get playgrounds owned by the logged-in owner
        owned_playgrounds = Playground.objects.filter(owner=user)

        if not owned_playgrounds.exists():
            return Response({"error": "You do not own any playgrounds"}, status=status.HTTP_403_FORBIDDEN)

        # Get bookings only for playgrounds owned by this user, ordered by recent date and time
        bookings = Booking.objects.filter(playground__in=owned_playgrounds).select_related('user', 'playground')\
                                  .order_by('date', 'time_slot')

        if not bookings.exists():
            return Response({"message": "No bookings found for your playgrounds"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize bookings and include customer details
        serialized_data = []
        for booking in bookings:
            serialized_data.append({
                "ticket_number": booking.ticket_number,
                "customer_name": booking.user.username,
                "customer_email": booking.user.email,
                "playground": booking.playground.name,
                "time_slot": booking.time_slot,
                "date": booking.date,
                "num_players": booking.num_players,
                "status": booking.status,
            })

        return Response(serialized_data, status=status.HTTP_200_OK)
    
class UpdateBookingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, ticket_number):
        try:
            booking = Booking.objects.get(ticket_number=ticket_number, playground__owner=request.user)
            new_status = request.data.get("status")

            if new_status not in ["Confirmed", "Rejected"]:
                return Response({"error": "Invalid status update"}, status=status.HTTP_400_BAD_REQUEST)

            booking.status = new_status
            booking.save()

            return Response({"message": "Booking status updated successfully"}, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)


class GetPlaygroundWeather(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request, id):
        playground = get_object_or_404(Playground, id=id)
        location = playground.location  # Ensure the location field exists
        print(f'got the location {location}..')

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
            return Response({"error": "Location is not set for this playground."}, status=400)
        
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
class MarkNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read"}, status=200)
    
class UnreadNotificationCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"unread_count": unread_count})
    
    
class DeleteNotifi(APIView):  # Ensure correct name here
    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.delete()
            return JsonResponse({"message": "Notification deleted successfully"}, status=200)
        except Notification.DoesNotExist:
            return JsonResponse({"error": "Notification not found"}, status=404)

class Location(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user  
        user_data = []

        if user.location:
            user_data.append({
                "username": user.username,
                "location": user.location
            })

        # Get all playground locations
        playgrounds = Playground.objects.all().values("name", "latitude", "longitude", "location")

        return JsonResponse({"users": user_data, "playgrounds": list(playgrounds)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated    
def fetch_google_fit_view(request):

    user_id = request.user.id  # Get user ID from the authenticated request
    print(user_id)
    if not user_id:
        return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)

    try:
        # Fetch all Google Fit data for user
        fit_data = fetch_all_google_fit_data(user_id)
        print("data:",fit_data)

        return JsonResponse({"status": "success", "data": fit_data}, status=200)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def google_fit_sign_out_view(request):
    """ API endpoint to sign out from Google Fit """
    user_id = request.user.id

    if not user_id:
        return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)

    response = google_fit_sign_out(user_id)  # Call sign-out function
    return JsonResponse(response, status=200 if response["status"] == "success" else 400)

    


class UVIndexView(View):
    """
    API view to fetch real-time UV index and sun protection advice for a playground.
    """
    def get(self, request, playground_id):
        try:
            playground = Playground.objects.get(id=playground_id)
        except Playground.DoesNotExist:
            return JsonResponse({"error": "Playground not found"}, status=404)

        API_KEY = "openuv-43570rm7lngfzn-io"
        if not playground.latitude or not playground.longitude:
            return JsonResponse({"error": "Playground does not have coordinates"}, status=400)

        url = f"https://api.openuv.io/api/v1/uv?lat={playground.latitude}&lng={playground.longitude}"
        headers = {"x-access-token": API_KEY}

        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json().get("result", {})

                uv_index = data.get("uv", None)
                uv_max = data.get("uv_max", None)
                uv_max_time = data.get("uv_max_time", None)
                ozone = data.get("ozone", None)
                sun_info = data.get("sun_info", {})
                safe_exposure = data.get("safe_exposure_time", {})

                sun_advice = self.get_sun_advice(uv_index)

                return JsonResponse({
                    "uv_index": uv_index,
                    "uv_max": uv_max,
                    "uv_max_time": uv_max_time,
                    "ozone": ozone,
                    "sun_protection_advice": sun_advice,
                    "safe_exposure_time": safe_exposure,
                    "sun_info": sun_info
                })
            else:
                return JsonResponse({"error": "Failed to fetch UV data"}, status=500)
        except requests.RequestException as e:
            return JsonResponse({"error": f"API request failed: {e}"}, status=500)

    def get_sun_advice(self, uv_index):
        """
        Returns sun protection advice based on the UV index level.
        """
        if uv_index is None:
            return "No UV data available."

        if uv_index < 3:
            return "Low UV risk. No special protection needed."
        elif 3 <= uv_index < 6:
            return "Moderate UV risk. Wear sunglasses and apply SPF 30+ sunscreen."
        elif 6 <= uv_index < 8:
            return "High UV risk. Wear protective clothing, sunglasses, and SPF 50+ sunscreen."
        elif 8 <= uv_index < 11:
            return "Very high UV risk. Avoid direct sun exposure, seek shade, and use SPF 50+ sunscreen."
        else:
            return "Extreme UV risk! Stay indoors between 10 AM - 4 PM, and apply SPF 50+ sunscreen frequently."


