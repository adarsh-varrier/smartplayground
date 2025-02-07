# your_app_name/authentication.py
from django.contrib.auth.backends import BaseBackend
from .models import CustomUser

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        try:
            # Try to get the user using email (since it's unique)
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return None

        # Check if the password is correct
        if user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None
