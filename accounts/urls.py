from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('user/', UserDetailView.as_view(), name='auth-user'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
