from django.urls import path,include
from .views import SubjectList
urlpatterns = [
    path("subjects/",SubjectList.as_view(),name="subject-list"),
]