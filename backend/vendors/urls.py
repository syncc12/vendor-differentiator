from django.urls import path
from .views import vendor_list, recommend_vendors

urlpatterns = [
    path('vendors/', vendor_list),
    path('recommend/', recommend_vendors),
]