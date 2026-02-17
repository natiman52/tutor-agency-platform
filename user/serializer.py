from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.serializers import LoginSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from .models import (MyUser, OTP, PasswordResetToken, Qualification, 
                    QualificationImage, Transaction,
                    Availability,Subject, Expertise)
from rest_framework import serializers

class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = ['id', 'name']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class CustomUserDetailSerializer(UserDetailsSerializer):
    expertise_details = ExpertiseSerializer(source='expertise', many=True, read_only=True)
    subject_details = SubjectSerializer(source='subject', read_only=True)
    
    class Meta:
        fields = [
            "id", "username", "first_name", "last_name", "email", 
            "is_phone_verified", "photo", "role", "location", 
            "subject", "subject_details", "hourly_rate", 
            "id_photo", "title", "expertise", "expertise_details"
        ]
        model = MyUser

class QualificationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualificationImage
        fields = ['id', 'image']

class QualificationSerializer(serializers.ModelSerializer):
    images = QualificationImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Qualification
        fields = [
            'id', 'user', 'title', 'type', 'status', 
            'description', 'link', 'pdf', 'word_doc', 
            'images', 'uploaded_images'
        ]
        read_only_fields = ['user', 'status']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        qualification = Qualification.objects.create(**validated_data)
        for image in uploaded_images:
            QualificationImage.objects.create(qualification=qualification, image=image)
        return qualification

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        instance = super().update(instance, validated_data)
        if uploaded_images:
            for image in uploaded_images:
                QualificationImage.objects.create(qualification=instance, image=image)
        return instance

class AvailabilitySerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = Availability
        fields = ['id', 'user', 'day_of_week', 'day_name', 'start_time', 'end_time']
        read_only_fields = ['user']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'status', 'reference', 'created_at']

class CustomLoginSerializer(LoginSerializer):
    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data) 
        return internal_value

class CustomRegisterSerializer(RegisterSerializer):
    location = serializers.CharField(required=True)
    phone_number = PhoneNumberField(required=True)
    role = serializers.ChoiceField(choices=MyUser.ROLE_CHOICES, required=True)
    password2 = None

    def validate(self, attrs):
        return attrs

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['phone_number'] = self.validated_data.get('phone_number', '')
        data['location'] = self.validated_data.get('location', '')
        data['role'] = self.validated_data.get('role', 'student')
        data["email"] = self.validated_data.get("email","")
        return data

class FinishSignupSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(required=True)
    location = serializers.CharField(required=True)
    role = serializers.ChoiceField(choices=MyUser.ROLE_CHOICES, required=True)
    
    class Meta:
        model = MyUser
        fields = [
            'phone_number', 'location', 'role', 'subject', 
            'hourly_rate', 'title', 'expertise'
        ]

    def validate(self, data):
        if data.get('role') == 'tutor':
            if not data.get('subject'):
                raise serializers.ValidationError({"subject": "Subject is required for tutors."})
            if not data.get('hourly_rate'):
                raise serializers.ValidationError({"hourly_rate": "Hourly rate is required for tutors."})
        return data

class CustomPasswordResetSerializer(serializers.Serializer):
    phone = PhoneNumberField(region="ET")
    def save(self,*args,**kwargs):
        user = MyUser.objects.filter(phone_number=self.validated_data.get("phone"))
        if(user.exists()):
            otp_obj,created = OTP.objects.get_or_create(user=user.first())
            print(otp_obj.code)
            return {"status":"success","message":"otp sent"}
        else:
            return {"status":"error","message":"The account does not exist"}

class PasswordRestTokenSeriailzer(serializers.Serializer):
    code = serializers.CharField()
    def save(self,*args,**kwargs):
        otp_obj = OTP.objects.filter(code=self.validated_data.get("code"))
        if(otp_obj.exists()):
            otp_obj,created = PasswordResetToken.objects.get_or_create(otp=otp_obj.first())
            return {"status":"success","message":"Everything works","token":otp_obj.code}
        else:
            return {"status":"error","message":"otp could't be verified"}

class ChangePasswordSerailzer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password =serializers.CharField(required=True)
    confirm_password =serializers.CharField(required=True)

    def validate(self,data):
        if(data.get("password") != data.get("confirm_password")):
            return serializers.ValidationError("Passwords dont match")
        return data