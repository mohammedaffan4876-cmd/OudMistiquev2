
#!/usr/bin/env bash
set -o errexit

# Render may invoke this script from a different working directory.
cd "$(dirname "$0")"
export DJANGO_SETTINGS_MODULE=config.settings

# Install Python dependencies first
echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

# Install Node.js dependencies and build React
echo "Building React frontend..."
npm ci
npm run build

echo "Verifying React build assets..."
test -s dist/index.html || { echo "ERROR: dist/index.html was not generated." >&2; exit 1; }
test -n "$(find dist/assets -maxdepth 1 -type f -name '*.js' -size +0c -print -quit)" || {
  echo "ERROR: no JavaScript asset was generated in dist/assets/." >&2
  exit 1
}
test -n "$(find dist/assets -maxdepth 1 -type f -name '*.css' -size +0c -print -quit)" || {
  echo "ERROR: no CSS asset was generated in dist/assets/." >&2
  exit 1
}

# Copy React entry point into Django templates
echo "Copying index.html to Django templates..."
mkdir -p templates
cp dist/index.html templates/index.html

# Collect Django static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Verifying collected frontend assets..."
test -n "$(find staticfiles/assets -maxdepth 1 -type f -name '*.js' -size +0c -print -quit)" || {
  echo "ERROR: no JavaScript asset was collected into staticfiles/assets/." >&2
  exit 1
}
test -n "$(find staticfiles/assets -maxdepth 1 -type f -name '*.css' -size +0c -print -quit)" || {
  echo "ERROR: no CSS asset was collected into staticfiles/assets/." >&2
  exit 1
}

echo "Applying database migrations..."
echo "Migrations run from the Render start command before Gunicorn starts."

echo "Build completed successfully!"
