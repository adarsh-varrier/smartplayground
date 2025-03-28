from django.urls import path
from .views import (
    PlaygroundRegisterView, OwnerPlaygroundsView, PlaygroundDetailView,
    PlaygroundCustomerView, PlaygroundDetailView2, BookPlayground,
    BookedSlotsView, BookingDetailView, OwnerBookingDetailView,
    UpdateBookingStatusView, GetPlaygroundWeather, NotificationListView,
    DeleteNotifi, Location, MarkNotificationsReadView, UnreadNotificationCountView, UVIndexView,
      # Correct import
)
from . import views
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.conf.urls.static import static


urlpatterns = [
    path('api/playg-register/', PlaygroundRegisterView.as_view(), name='playground-register'),
    path('api/owner-playg/', OwnerPlaygroundsView.as_view(), name='playground-view'),
    path('api/owner-playg/<int:id>/', PlaygroundDetailView.as_view(), name='playground-detail'),
    path('api/playg-customer/', PlaygroundCustomerView.as_view(), name='playground-list'),
    path('api/playg-customer/<int:id>/', PlaygroundDetailView2.as_view(), name='playground-detail_customer'),
    path('api/playg-customer_weather/<int:id>/', GetPlaygroundWeather.as_view(), name='playground-weather-customer'),
    path('api/playgrounds/<int:playground_id>/book/', BookPlayground.as_view(), name='book_playground'),
    path('api/playgrounds/<int:playground_id>/booked-slots/', BookedSlotsView.as_view(), name='booked-slots'),
    path('api/bookings/', BookingDetailView.as_view(), name='all_bookings'),
    path('api/confirmation/', OwnerBookingDetailView.as_view(), name='booked_user'),
    path('api/update-booking/<str:ticket_number>/', UpdateBookingStatusView.as_view(), name='update_booking'),
    path('api/notifications/', NotificationListView.as_view(), name='notification'),   
    path("api/notifications/<int:notification_id>/", DeleteNotifi.as_view(), name="delete-notification"),
    path('api/notifications/mark-read/', MarkNotificationsReadView.as_view(), name='mark-notifications-read'), 
    path('api/notifications/unread-count/', UnreadNotificationCountView.as_view(), name='unread-count'),
    path('api/locations/', Location.as_view(), name='get_locations'),
    path('api/google-fit/', views.fetch_google_fit_view, name='fetch_google_fit'),
    path('api/google-fit/sign-out/', views.google_fit_sign_out_view, name='google_fit_sign_out'),
    path("api/playground/<int:playground_id>/uv-data/", UVIndexView.as_view(), name="uv-data"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
