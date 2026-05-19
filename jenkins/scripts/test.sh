#!/usr/bin/env sh

set -e

echo '=== Running Lint ==='
npm run lint

echo '=== Validating Build Environment ==='
missing_env=''

for env_name in \
  NEXT_PUBLIC_SUPABASE_URL \
  NEXT_PUBLIC_SUPABASE_ANON_KEY \
  SUPABASE_SERVICE_ROLE_KEY \
  JWT_SECRET_KEY \
  MIDTRANS_SERVER_KEY
do
  eval "env_value=\${$env_name:-}"
  if [ -z "$env_value" ]; then
    missing_env="$missing_env $env_name"
  fi
done

if [ -n "$missing_env" ]; then
  echo "Missing required environment variables:$missing_env"
  exit 1
fi

echo '=== Running Build ==='
npm run build

echo '=== All tests passed ==='
