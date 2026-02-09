from django.urls import path,include
from .views import *

urlpatterns = [
    path("completesignup", CompleteSignup.as_view(),name="complete_signup"),

    ## password reset views
    path('password/reset/',PasswordResetView.as_view(),name="start_password_reset"),
    path("password/reset/verify",PasswordResetOTPVerify.as_view(),name="password_reset_otp"),
    path("changepassword",ChangePasswordView.as_view(),name="passwordchange"),


    path("verifyotp", VerifyCode.as_view(),name="verify_otp_code"),
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('', include('dj_rest_auth.urls')),
    path('registration/', include('dj_rest_auth.registration.urls')),
]