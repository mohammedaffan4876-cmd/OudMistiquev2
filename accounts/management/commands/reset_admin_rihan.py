from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Resets admin password for production recovery"

    def handle(self, *args, **options):

        username = "rihanmalik.k786@gmail.com"

        self.stdout.write("Starting password reset...")

        users = User.objects.all()

        self.stdout.write("Users in database:")

        for u in users:
            self.stdout.write(
                f"{u.username} | staff={u.is_staff} | superuser={u.is_superuser}"
            )

        try:
            user = User.objects.get(username=username)

            user.set_password("Kinley@2233")
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    "Admin password reset successfully"
                )
            )

        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f"User '{username}' not found."
                )
            )