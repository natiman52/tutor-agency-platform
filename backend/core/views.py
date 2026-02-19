from rest_framework.generics import ListAPIView
from user.models import Subject, Expertise
from .serializers import SubjectSerializer, ExpertiseSerializer
from django_filters.rest_framework import DjangoFilterBackend

class SubjectList(ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains']}

class ExpertiseList(ListAPIView):
    queryset = Expertise.objects.all()
    serializer_class = ExpertiseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains']}