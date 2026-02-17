from django.contrib import admin
from .models import MyUser,OTP,PasswordResetToken,Qualification,QualificationImage,Availability,Expertise,Subject
# Register your models here.

@admin.register(Expertise)
class ExpertiseAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name',)
@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'status')

@admin.register(QualificationImage)
class QualificationImageAdmin(admin.ModelAdmin):
    list_display = ('qualification', 'image')

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('user', 'day_of_week', 'start_time', 'end_time')

@admin.register(MyUser)
class MyUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff')

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'expire_date')

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('otp', 'code', 'expire_date')