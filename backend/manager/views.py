from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from user.models import MyUser, Qualification
from .serializers import AdminUserVerificationSerializer, AdminQualificationVerificationSerializer
from .permission import IsAdmin

class PendingUserVerificationListView(ListAPIView):
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        # List users who have an ID photo but are not verified yet
        return MyUser.objects.filter(is_id_verified=False).exclude(id_photo='')

class UserVerificationDetailView(RetrieveUpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        is_verified = request.data.get('is_id_verified')
        
        if is_verified is not None:
            instance.is_id_verified = is_verified
            instance.save()
            return Response({"status": "success", "message": f"User verification status updated to {is_verified}."}, status=status.HTTP_200_OK)
        
        return Response({"error": "is_id_verified field is required."}, status=status.HTTP_400_BAD_REQUEST)

class PendingQualificationListView(ListAPIView):
    serializer_class = AdminQualificationVerificationSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return Qualification.objects.filter(status='pending')

class QualificationVerificationDetailView(RetrieveUpdateAPIView):
    queryset = Qualification.objects.all()
    serializer_class = AdminQualificationVerificationSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['approved', 'rejected']:
            instance.status = new_status
            instance.save()
            return Response({"status": "success", "message": f"Qualification status updated to {new_status}."}, status=status.HTTP_200_OK)
        
        return Response({"error": "A valid status (approved/rejected) is required."}, status=status.HTTP_400_BAD_REQUEST)
