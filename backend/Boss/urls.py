from django.urls import path
from .views import AdminDashboardView, DeleteAdminView, CreateAdminView, PlaygroundAdminView, SubmitRatingView, AverageRatingView

urlpatterns = [
    path('api/users/', AdminDashboardView.as_view(), name='admin_dashboard'),  # GET for users
    path('api/users/<int:user_id>/', AdminDashboardView.as_view(), name='delete_user'),  # DELETE for user removal
    path("api/users/admin/<int:user_id>/", DeleteAdminView.as_view(), name="delete-user"),
    path("api/create-admin/", CreateAdminView.as_view(), name="create-admin"),
    path('api/playgrounds/', PlaygroundAdminView.as_view(), name='get_playgrounds'),
    path('api/playgrounds/<int:id>/', PlaygroundAdminView.as_view(), name='playground-delete'),
    path("api/submit-rating/", SubmitRatingView.as_view(), name="submit_rating"),
    path("api/average-rating/", AverageRatingView.as_view(), name="average_rating"),
]
