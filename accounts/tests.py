from django.contrib.auth.models import User
from rest_framework.test import APITestCase


class AuthenticationApiTests(APITestCase):
    def test_registers_and_hashes_password(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'new@example.com',
            'password': 'A-secure-password-123',
            'first_name': 'New',
            'last_name': 'Customer',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username='new@example.com')
        self.assertNotEqual(user.password, 'A-secure-password-123')
        self.assertTrue(user.check_password('A-secure-password-123'))

    def test_duplicate_email_returns_bad_request(self):
        User.objects.create_user(username='existing@example.com', email='existing@example.com', password='A-secure-password-123')

        response = self.client.post('/api/auth/register/', {
            'email': 'EXISTING@example.com',
            'password': 'A-secure-password-123',
        }, format='json')

        self.assertEqual(response.status_code, 400)

    def test_login_returns_tokens(self):
        User.objects.create_user(username='login@example.com', email='login@example.com', password='A-secure-password-123')

        response = self.client.post('/api/auth/login/', {
            'email': 'LOGIN@example.com',
            'password': 'A-secure-password-123',
        }, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
