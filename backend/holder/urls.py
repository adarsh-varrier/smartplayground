from django.urls import path
from .views import PlaygroundRegisterView, OwnerPlaygroundsView, PlaygroundDetailView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/playg-register/', PlaygroundRegisterView.as_view(), name='playground-register'),
    path('api/owner-playg/', OwnerPlaygroundsView.as_view(), name='playground-view'),
    path('api/owner-playg/<int:id>/', PlaygroundDetailView.as_view(), name='playground-detail'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
