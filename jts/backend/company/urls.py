from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from company import views

urlpatterns = [
    path('', views.companies),
    path('<int:company_pk>/positions/',
         views.positions),
]
urlpatterns = format_suffix_patterns(urlpatterns)
