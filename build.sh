
#!/usr/bin/env bash
set -o errexit

# Render may invoke this script from a different working directory.
cd "$(dirname "$0")"
export DJANGO_SETTINGS_MODULE=config.settings

# Install Python dependencies first
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies and build React
echo "Building React frontend..."
npm ci
npm run build

# Copy React entry point into Django templates
echo "Copying index.html to Django templates..."
mkdir -p templates
cp dist/index.html templates/index.html

# Collect Django static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully!"
