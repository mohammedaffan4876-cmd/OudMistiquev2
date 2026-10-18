from django.test import TestCase
from decimal import Decimal
from unittest.mock import Mock, patch
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from products.models import Category, Product
from .models import Cart, CartItem, Order


class RazorpayFlowTests(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(username='buyer', password='test-password')
		self.category = Category.objects.create(name='Perfume')
		self.product = Product.objects.create(
			name='Test scent', description='Test product', gender='unisex',
			perfume_price_30ml=Decimal('125.00'), category=self.category,
		)
		self.cart = Cart.objects.create(user=self.user)
		CartItem.objects.create(cart=self.cart, product=self.product, quantity=2, size='30ml')
		self.client = APIClient()
		self.client.force_authenticate(self.user)
		self.shipping = {
			'full_name': 'Test Buyer', 'email': 'buyer@example.com', 'phone': '9876543210',
			'address': '1 Test Road', 'city': 'Test City', 'state': 'Test State', 'pincode': '123456',
		}

	@patch('orders.views.get_razorpay_client')
	def test_create_gateway_order_uses_server_cart_total(self, get_client):
		gateway = Mock()
		gateway.order.create.return_value = {'id': 'rzp_order_123'}
		get_client.return_value = gateway

		response = self.client.post('/api/razorpay/orders/', self.shipping, format='json')

		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data['amount'], 25000)
		self.assertEqual(response.data['razorpay_order_id'], 'rzp_order_123')
		self.assertEqual(Order.objects.get().total, Decimal('250.00'))
		self.assertEqual(self.cart.items.count(), 1)

	@patch('orders.views.get_razorpay_client')
	def test_verification_only_marks_captured_matching_payment_paid(self, get_client):
		order = Order.objects.create(
			user=self.user, payment_method='razorpay', total=Decimal('250.00'),
			razorpay_order_id='rzp_order_123', **self.shipping,
		)
		gateway = Mock()
		gateway.payment.fetch.return_value = {
			'order_id': 'rzp_order_123', 'amount': 25000, 'currency': 'INR', 'status': 'captured',
		}
		get_client.return_value = gateway

		response = self.client.post('/api/razorpay/verify/', {
			'order_id': order.pk,
			'razorpay_order_id': 'rzp_order_123',
			'razorpay_payment_id': 'pay_123',
			'razorpay_signature': 'signature',
		}, format='json')

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['payment_status'], 'paid')
		self.assertEqual(Order.objects.get(pk=order.pk).razorpay_payment_id, 'pay_123')
		gateway.utility.verify_payment_signature.assert_called_once()

	@patch('orders.views.get_razorpay_client')
	def test_uncaptured_payment_remains_unpaid(self, get_client):
		order = Order.objects.create(
			user=self.user, payment_method='razorpay', total=Decimal('250.00'),
			razorpay_order_id='rzp_order_123', **self.shipping,
		)
		gateway = Mock()
		gateway.payment.fetch.return_value = {
			'order_id': 'rzp_order_123', 'amount': 25000, 'currency': 'INR', 'status': 'authorized',
		}
		get_client.return_value = gateway

		response = self.client.post('/api/razorpay/verify/', {
			'order_id': order.pk,
			'razorpay_order_id': 'rzp_order_123',
			'razorpay_payment_id': 'pay_123',
			'razorpay_signature': 'signature',
		}, format='json')

		self.assertEqual(response.status_code, 409)
		order.refresh_from_db()
		self.assertEqual(order.payment_status, 'pending')

	def test_legacy_order_endpoint_rejects_unverified_upi(self):
		response = self.client.post('/api/orders/', {
			**self.shipping,
			'payment_method': 'upi',
			'items': [{'product': self.product.pk, 'quantity': 1, 'size': '30ml'}],
		}, format='json')

		self.assertEqual(response.status_code, 400)
		self.assertEqual(Order.objects.count(), 0)
