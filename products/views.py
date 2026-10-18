from django.db.models import Q
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all().select_related('category')
        
        category = self.request.query_params.get('category')
        if category:
            category = category.lower().strip()
            if category in ['men', 'male']:
                queryset = queryset.filter(Q(category__name__iexact='men') | Q(gender='male'))
            elif category in ['women', 'female']:
                queryset = queryset.filter(Q(category__name__iexact='women') | Q(gender='female'))
            elif category == 'unisex':
                queryset = queryset.filter(Q(category__name__iexact='unisex') | Q(gender='unisex'))
            else:
                queryset = queryset.filter(category__name__iexact=category)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(perfume_price_30ml__gte=min_price)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(perfume_price_30ml__lte=max_price)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(fragrance_notes__icontains=search)
            )

        return queryset