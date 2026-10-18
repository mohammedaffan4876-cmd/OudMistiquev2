from django.urls import path
from .views import (
    CartView, CartAddView, CartItemDetailView, 
    OrderListCreateView, RazorpayOrderCreateView, RazorpayVerifyView, RazorpayWebhookView,
    WishlistView, WishlistAddView, WishlistDeleteView
)

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', CartAddView.as_view(), name='cart-add'),
    path('cart/item/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('razorpay/orders/', RazorpayOrderCreateView.as_view(), name='razorpay-order-create'),
    path('razorpay/verify/', RazorpayVerifyView.as_view(), name='razorpay-verify'),
    path('razorpay/webhook/', RazorpayWebhookView.as_view(), name='razorpay-webhook'),
    path('wishlist/', WishlistView.as_view(), name='wishlist-list'),
    path('wishlist/add/', WishlistAddView.as_view(), name='wishlist-add'),
    path('wishlist/<int:pk>/', WishlistDeleteView.as_view(), name='wishlist-delete'),
]
