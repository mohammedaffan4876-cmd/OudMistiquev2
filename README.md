# Oud Mistique - Luxury Perfume Ecommerce

## Frontend (React + Vite)

```bash
npm install
npm run dev
```

## Backend (Django REST API)

Ensure the Django backend is running at `http://localhost:8000` with the following API endpoints:

- `/api/auth/login/` - JWT login
- `/api/auth/register/` - User registration
- `/api/auth/refresh/` - Token refresh
- `/api/products/` - Product listing
- `/api/cart/` - Cart operations
- `/api/orders/` - Order management
- `/api/wishlist/` - Wishlist operations

## Features

- JWT Authentication
- Product listing with filters (category, price range, search)
- Shopping cart with quantity updates
- Wishlist functionality
- Checkout with COD and UPI payment
- QR code payment for UPI
- Admin dashboard
- Toast notifications
- Responsive luxury UI with gold/cream theme

## UPI Payment

Online payments use Razorpay Checkout. For local setup, copy `.env.example` to `.env`, replace the three Razorpay placeholders with Test Mode credentials from the Razorpay Dashboard, and keep `.env` private. Django loads it locally; `.env` is ignored by Git. Never put the secret in a `VITE_` variable or commit it.

```bash
cp .env.example .env
./.venv/bin/python manage.py migrate
```

In Razorpay, switch to Test Mode and generate API keys. Use the Key ID and Key Secret in `.env`; create a separate webhook secret and set it as `RAZORPAY_WEBHOOK_SECRET`. Configure the webhook URL `https://<your-public-backend-domain>/api/razorpay/webhook/` for `payment.captured` and `payment.failed`. The endpoint must be publicly reachable over HTTPS. The frontend receives only the public Key ID from the backend. Use test credentials until the merchant account is approved for live payments.

## Cloudinary

For local image uploads, copy `.env.example` to `.env` and set your Cloudinary credentials there. Django loads `.env` locally, and `.env` is ignored by Git. In production, set the same variables in your hosting provider's private environment settings. Rotate any Cloudinary API secret that was previously stored in `.env.production`.# OudMistiquev2
