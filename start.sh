#!/usr/bin/env bash
set -o errexit

cd "$(dirname "$0")"
python manage.py migrate --noinput
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}
