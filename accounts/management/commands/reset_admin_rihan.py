from django.core.management.base import BaseCommand, CommandError
import os

from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Resets admin password for production recovery"

    def handle(self, *args, **options):

        username = os.environ.get('ADMIN_USERNAME')
        password = os.environ.get('ADMIN_PASSWORD')
        email = os.environ.get('ADMIN_EMAIL', username)
        if not username or not password:
            raise CommandError('ADMIN_USERNAME and ADMIN_PASSWORD must be set')

        user_model = get_user_model()
        user, created = user_model.objects.get_or_create(
            username=username,
            defaults={'email': email},
        )
        user.email = email
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        self.stdout.write(self.style.SUCCESS('Admin account bootstrapped'))
