from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'gender', 'stock', 'featured', 'created_at')
    list_filter = ('category', 'gender', 'featured', 'created_at')
    search_fields = ('name', 'description', 'fragrance_notes')
    prepopulated_fields = {}  # Not used, but if we had slug we would use it
    readonly_fields = ('created_at',)
