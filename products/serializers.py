from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    image = serializers.SerializerMethodField()
    price = serializers.DecimalField(source='perfume_price_30ml', max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'image', 
            'fragrance_notes', 'gender', 
            'attar_price_6ml', 'attar_price_12ml', 
            'perfume_price_20ml', 'perfume_price_30ml', 'perfume_price_50ml',
            'price',
            'wear_to_use', 'stock', 'featured', 'created_at',
            'category', 'category_id'
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None