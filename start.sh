#!/usr/bin/env bash
set -o errexit

cd "$(dirname "$0")"
python manage.py migrate --noinput
if [[ -n "${ADMIN_USERNAME:-}" && -n "${ADMIN_PASSWORD:-}" ]]; then
  python manage.py reset_admin_rihan
fi
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}
