#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Node.js dependencies and build the React app
echo "Building React frontend..."
npm ci
chmod +x ./node_modules/.bin/vite
npm run build

# Ensure the templates directory exists and copy index.html
echo "Copying index.html to Django templates..."
mkdir -p templates
cp dist/index.html templates/index.html

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files for Django
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully!"
