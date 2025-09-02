from django.urls import path
from . import views

urlpatterns = [
    path('api/posts/', views.post_list, name='post_list'),
    path('api/posts/<int:pk>/', views.post_detail, name='post_detail'),
]
