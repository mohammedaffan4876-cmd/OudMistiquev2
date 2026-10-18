from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'size', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'payment_method', 'total', 'created_at']
    list_filter = ['payment_method', 'created_at']
    search_fields = ['id', 'full_name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    inlines = [OrderItemInline]

    fieldsets = [
        ('Customer Info', {
            'fields': ('user', 'full_name', 'email', 'phone')
        }),
        ('Shipping Address', {
            'fields': ('address', 'city', 'state', 'pincode')
        }),
        ('Payment & Total', {
            'fields': ('payment_method', 'total', 'created_at', 'updated_at')
        }),
    ]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'size', 'quantity', 'price']
    list_filter = ['product']
    search_fields = ['order__id', 'product__name']
