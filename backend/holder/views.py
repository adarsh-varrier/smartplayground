# owner/views.py
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Playground
from holder.serializers import PlaygroundSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

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

    def get(self, request, id):
        playground = get_object_or_404(Playground, id=id)
        serializer = PlaygroundSerializer(playground)
        return Response(serializer.data)