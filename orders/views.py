import hashlib
import hmac
import json
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem, Wishlist
from products.models import Product
from .serializers import CartSerializer, OrderSerializer, WishlistSerializer


def get_razorpay_client():
    import razorpay

    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise ImproperlyConfigured('Razorpay API keys are not configured.')
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def mark_order_paid(order, payment_id):
    with transaction.atomic():
        order = Order.objects.select_for_update().get(pk=order.pk)
        if order.payment_status != 'paid':
            order.payment_status = 'paid'
            order.razorpay_payment_id = payment_id
            order.save(update_fields=['payment_status', 'razorpay_payment_id', 'updated_at'])
            CartItem.objects.filter(cart__user=order.user).delete()
    return order

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class CartAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))
        size = request.data.get('size')

        if not size:
            return Response({"error": "Size is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product, size=size)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        try:
            cart_item = CartItem.objects.get(id=pk, cart=cart)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        try:
            cart_item = CartItem.objects.get(id=pk, cart=cart)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if request.data.get('payment_method') == 'razorpay':
            return Response(
                {'error': 'Use the Razorpay order endpoint to pay securely.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.data.get('payment_method', 'cod') != 'cod':
            return Response(
                {'error': 'Only cash on delivery is supported by this endpoint.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        full_name = (request.data.get('full_name') or '').strip()
        email = (request.data.get('email') or '').strip()
        phone = (request.data.get('phone') or '').strip()
        address = (request.data.get('address') or '').strip()
        city = (request.data.get('city') or '').strip()
        state = (request.data.get('state') or '').strip()
        pincode = (request.data.get('pincode') or '').strip()
        payment_method = (request.data.get('payment_method') or 'cod').strip()
        items_data = request.data.get('items', [])

        if not items_data:
            return Response({"error": "No items in order"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            city=city,
            state=state,
            pincode=pincode,
            payment_method=payment_method,
            total=0.0
        )

        total_price = 0
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product'])
            except Product.DoesNotExist:
                return Response({"error": f"Product with id {item['product']} not found"}, status=status.HTTP_400_BAD_REQUEST)

            qty = int(item['quantity'])
            size = item.get('size', '30ml')
            price = product.get_price_for_size(size)
            total_price += price * qty

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                size=size,
                price=price
            )

        order.total = total_price
        order.save()

        # Clear cart
        cart, _ = Cart.objects.get_or_create(user=request.user)
        CartItem.objects.filter(cart=cart).delete()

        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RazorpayOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            client = get_razorpay_client()
        except ImproperlyConfigured:
            return Response({'error': 'Razorpay is not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        required_fields = ('full_name', 'email', 'phone', 'address', 'city', 'state', 'pincode')
        order_data = {field: str(request.data.get(field, '')).strip() for field in required_fields}
        if any(not value for value in order_data.values()):
            return Response({'error': 'Complete all shipping fields before payment.'}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = list(cart.items.select_related('product'))
        if not cart_items:
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        line_items = []
        total = Decimal('0.00')
        for item in cart_items:
            price = item.product.get_price_for_size(item.size)
            if item.quantity < 1 or price <= 0:
                return Response({'error': 'The cart contains an invalid item.'}, status=status.HTTP_400_BAD_REQUEST)
            line_items.append((item, price))
            total += price * item.quantity

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                payment_method='razorpay',
                payment_status='pending',
                total=total,
                **order_data,
            )
            OrderItem.objects.bulk_create([
                OrderItem(order=order, product=item.product, quantity=item.quantity, size=item.size, price=price)
                for item, price in line_items
            ])

        try:
            gateway_order = client.order.create(data={
                'amount': int(total * 100),
                'currency': 'INR',
                'receipt': f'order-{order.pk}',
            })
        except Exception:
            order.payment_status = 'failed'
            order.save(update_fields=['payment_status', 'updated_at'])
            return Response({'error': 'Could not start Razorpay checkout.'}, status=status.HTTP_502_BAD_GATEWAY)

        order.razorpay_order_id = gateway_order['id']
        order.save(update_fields=['razorpay_order_id', 'updated_at'])
        return Response({
            'order_id': order.pk,
            'razorpay_order_id': order.razorpay_order_id,
            'amount': int(total * 100),
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID,
            'name': 'Oud Mistique',
            'email': order.email,
            'contact': order.phone,
        }, status=status.HTTP_201_CREATED)


class RazorpayVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order = get_object_or_404(
            Order,
            pk=request.data.get('order_id'),
            user=request.user,
            payment_method='razorpay',
        )
        gateway_order_id = request.data.get('razorpay_order_id', '')
        payment_id = request.data.get('razorpay_payment_id', '')
        signature = request.data.get('razorpay_signature', '')
        if not all((gateway_order_id, payment_id, signature)) or gateway_order_id != order.razorpay_order_id:
            return Response({'error': 'Invalid payment details.'}, status=status.HTTP_400_BAD_REQUEST)
        if order.payment_status == 'paid':
            return Response(OrderSerializer(order).data)

        try:
            client = get_razorpay_client()
            client.utility.verify_payment_signature({
                'razorpay_order_id': gateway_order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature,
            })
            payment = client.payment.fetch(payment_id)
        except Exception:
            return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        if (
            payment.get('order_id') != gateway_order_id
            or payment.get('amount') != int(order.total * 100)
            or payment.get('currency') != 'INR'
            or payment.get('status') != 'captured'
        ):
            return Response({'error': 'Payment has not been captured for this order.'}, status=status.HTTP_409_CONFLICT)

        order = mark_order_paid(order, payment_id)
        return Response(OrderSerializer(order).data)


@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        secret = settings.RAZORPAY_WEBHOOK_SECRET
        signature = request.headers.get('X-Razorpay-Signature', '')
        expected = hmac.new(secret.encode(), request.body, hashlib.sha256).hexdigest() if secret else ''
        if not expected or not hmac.compare_digest(signature, expected):
            return JsonResponse({'error': 'Invalid webhook signature.'}, status=400)

        try:
            payload = json.loads(request.body)
            event = payload['event']
            payment = payload['payload']['payment']['entity']
        except (KeyError, TypeError, json.JSONDecodeError):
            return JsonResponse({'error': 'Invalid webhook payload.'}, status=400)

        if event not in ('payment.captured', 'payment.failed'):
            return JsonResponse({'status': 'ignored'})

        order = get_object_or_404(Order, razorpay_order_id=payment.get('order_id'), payment_method='razorpay')
        if payment.get('amount') != int(order.total * 100) or payment.get('currency') != 'INR':
            return JsonResponse({'error': 'Payment does not match the order.'}, status=400)

        if event == 'payment.captured' and payment.get('status') == 'captured':
            mark_order_paid(order, payment['id'])
        elif event == 'payment.failed' and order.payment_status == 'pending':
            order.payment_status = 'failed'
            order.save(update_fields=['payment_status', 'updated_at'])
        return JsonResponse({'status': 'ok'})

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlist, many=True, context={'request': request})
        return Response(serializer.data)

class WishlistAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        serializer = WishlistSerializer(wishlist_item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class WishlistDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            # pk in parameter is the product_id passed from frontend
            wishlist_item = Wishlist.objects.get(user=request.user, product_id=pk)
            wishlist_item.delete()
            return Response({"message": "Removed from wishlist"}, status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({"error": "Wishlist item not found"}, status=status.HTTP_404_NOT_FOUND)
