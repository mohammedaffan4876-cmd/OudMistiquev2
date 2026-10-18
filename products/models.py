from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]
    WEAR_TO_USE_CHOICES = [
        ('daily', 'Daily'),
        ('evening', 'Evening'),
        ('special', 'Special Occasion'),
        ('sport', 'Sport'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    fragrance_notes = models.TextField(blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    attar_price_6ml = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    attar_price_12ml = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    perfume_price_20ml = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    perfume_price_30ml = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    perfume_price_50ml = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    wear_to_use = models.CharField(max_length=10, choices=WEAR_TO_USE_CHOICES, default='daily')
    stock = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def get_price_for_size(self, size):
        if not size:
            if self.category and 'attar' in self.category.name.lower():
                return self.attar_price_6ml or self.attar_price_12ml or 0
            return self.perfume_price_30ml or self.perfume_price_20ml or self.perfume_price_50ml or 0

        size = str(size).lower().strip()
        if size == '6ml':
            return self.attar_price_6ml
        elif size == '12ml':
            return self.attar_price_12ml
        elif size == '20ml':
            return self.perfume_price_20ml
        elif size == '30ml':
            return self.perfume_price_30ml
        elif size == '50ml':
            return self.perfume_price_50ml
        
        if self.category and 'attar' in self.category.name.lower():
            return self.attar_price_6ml or self.attar_price_12ml or 0
        return self.perfume_price_30ml or self.perfume_price_20ml or self.perfume_price_50ml or 0

    def __str__(self):
        return self.name