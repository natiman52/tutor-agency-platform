from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import OTP, PasswordResetToken

class Command(BaseCommand):
    help = 'Deletes expired OTPs and Password Reset Tokens'

    def handle(self, *args, **options):
        now = timezone.now()
        
        # Cleanup OTPs
        expired_otps = OTP.objects.filter(expire_date__lt=now)
        otp_count = expired_otps.count()
        expired_otps.delete()
        
        # Cleanup PasswordResetTokens
        expired_tokens = PasswordResetToken.objects.filter(expire_date__lt=now)
        token_count = expired_tokens.count()
        expired_tokens.delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {otp_count} expired OTPs and {token_count} expired tokens.')
        )
