from django.urls import path
from .views import AdminDashboardView, DeleteAdminView, CreateAdminView, PlaygroundAdminView, SubmitRatingView, AverageRatingView, ReviewListCreateView, ReviewDeleteView, FAQListCreateView, FAQUpdateDeleteView, FAQSearchView

urlpatterns = [
    path('api/users/', AdminDashboardView.as_view(), name='admin_dashboard'),  # GET for users
    path('api/users/<int:user_id>/', AdminDashboardView.as_view(), name='delete_user'),  # DELETE for user removal
    path("api/users/admin/<int:user_id>/", DeleteAdminView.as_view(), name="delete-user"),
    path("api/create-admin/", CreateAdminView.as_view(), name="create-admin"),
    path('api/playgrounds/', PlaygroundAdminView.as_view(), name='get_playgrounds'),
    path('api/playgrounds/<int:id>/', PlaygroundAdminView.as_view(), name='playground-delete'),
    path("api/submit-rating/", SubmitRatingView.as_view(), name="submit_rating"),
    path("api/average-rating/", AverageRatingView.as_view(), name="average_rating"),
    path('api/playgroundReview/<int:playground_id>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('api/playgroundReview/reviews/<int:pk>/delete/', ReviewDeleteView.as_view(), name='delete-review'),
    path('api/faqs/', FAQListCreateView.as_view(), name='faq_list_create'),
    path('api/faqs/<int:id>/', FAQUpdateDeleteView.as_view(), name='faq_update_delete'),
    path('api/faq/search/', FAQSearchView.as_view(), name='faq_search'),
]
