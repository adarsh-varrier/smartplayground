from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from smartplay.models import CustomUser
from rest_framework import status
from django.contrib.auth.hashers import make_password
from holder.models import Playground
from Boss.serializers import PlaygroundSerializer
from rest_framework.permissions import IsAuthenticated
from .models import AppRating
from django.db.models import Avg

from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Review, Playground
from .serializers import ReviewSerializer

# Admin Dashboard API View
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]  # Only admin users can access

    def get(self, request):
        """Fetch non-admin users (Owners & Customers separately) and admin users."""
        owners = CustomUser.objects.filter(is_superuser=False, user_type="Owner").values(
            'id', 'username', 'email', 'location'
        )
        customers = CustomUser.objects.filter(is_superuser=False, user_type="Customer").values(
            'id', 'username', 'email', 'location'
        )
        admin_users = CustomUser.objects.filter(is_superuser=True).values(
            'id', 'username', 'email'
        )

        return Response({
            'owners': list(owners),
            'customers': list(customers),
            'admin_users': list(admin_users),
        })



    def delete(self, request, user_id):
        """Delete a user by ID (Only non-admin users)."""
        user = get_object_or_404(CustomUser, id=user_id, is_superuser=False)
        username = user.username
        user.delete()
        return Response({'message': f'User {username} deleted successfully'}, status=status.HTTP_200_OK)
    
class DeleteAdminView(APIView):
    permission_classes = [IsAdminUser]  # Only admins can delete users

    def delete(self, request, user_id):
        """Delete a user (admin deletion requires password verification)."""
        user = get_object_or_404(CustomUser, id=user_id)

        # Get password from request data
        password = request.data.get("password")

        # If deleting an admin, verify password first
        if user.is_superuser:
            if not password:
                return Response({"error": "Password is required to delete an admin."}, status=status.HTTP_400_BAD_REQUEST)

            if not request.user.check_password(password):
                return Response({"error": "Incorrect password."}, status=status.HTTP_403_FORBIDDEN)

        # Delete user
        user.delete()
        return Response({"message": f"User {user.username} deleted successfully."}, status=status.HTTP_200_OK)
    
class CreateAdminView(APIView):
    permission_classes = [IsAdminUser]  # Only superusers can create new admins

    def post(self, request):
        """Create a new admin user."""
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields are required!"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user already exists
        if CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists():
            return Response({"error": "User with this username or email already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        # Create new superuser
        admin_user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            is_superuser=True,
            is_staff=True
        )

        return Response({"message": f"Admin {admin_user.username} created successfully!"}, status=status.HTTP_201_CREATED)
    

class PlaygroundAdminView(APIView):
    permission_classes = [IsAdminUser]  # Ensure only logged-in users can access

    def get(self, request, *args, **kwargs):
        playgrounds = Playground.objects.select_related('owner').all()  # Optimized query
        serializer = PlaygroundSerializer(playgrounds, many=True)
        return Response(serializer.data)
    
    def delete(self, request, id, *args, **kwargs):
        try:
            playground = Playground.objects.get(id=id)
            playground.delete()
            return Response({"message": "Playground deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Playground.DoesNotExist:
            return Response({"error": "Playground not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SubmitRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        rating = request.data.get('rating')
        if not rating or int(rating) not in range(1, 6):
            return Response({"error": "Invalid rating. Must be between 1 and 5."}, status=400)

        app_rating, created = AppRating.objects.update_or_create(
            user=request.user,
            defaults={"rating": rating}
        )
        return Response({"message": "Rating submitted successfully!"})

class AverageRatingView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        avg_rating = AppRating.objects.aggregate(Avg('rating'))['rating__avg'] or 0
        return Response({"average_rating": round(avg_rating, 2)})
    

class ReviewListCreateView(generics.ListCreateAPIView):
    """
    Allows users to see all reviews for a specific playground and add a new review.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        playground_id = self.kwargs['playground_id']
        return Review.objects.filter(playground_id=playground_id)

    def perform_create(self, serializer):
        playground = get_object_or_404(Playground, id=self.kwargs['playground_id'])
        serializer.save(user=self.request.user, playground=playground)


class ReviewDeleteView(generics.DestroyAPIView):
    """
    Allows owners to delete reviews from their playgrounds.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(playground__owner=self.request.user)