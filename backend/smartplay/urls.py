# urls.py
from django.urls import path
from . import views
from .views import test_view
from .views import RegisterView
from django.contrib.auth.views import LoginView
from .views import LogoutView, UserDetailsView,user_settings

urlpatterns = [
    path('api/test/', test_view, name='test_view'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/user-details/', UserDetailsView.as_view(), name='user-details'),
    path('api/settings/', user_settings, name="user-settings"),
    path('api/weather/', views.get_user_weather, name='get_user_weather'),
]
