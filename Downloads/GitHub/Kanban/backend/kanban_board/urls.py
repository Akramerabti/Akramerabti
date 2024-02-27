from django.urls import path
from . import views
from .views import BoardViewSet, EventListCreateView, EventDetailUpdateDeleteView

urlpatterns = [
    path('signup/', views.signup_view), 
    path('login/', views.login_view), 
    path('logout/', views.logout_view), 
    path('whoami/', views.whoami_view), 
    path('scheduler/', EventListCreateView),
    path('scheduler/<int:pk>/', EventDetailUpdateDeleteView),
    ]