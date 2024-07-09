#!/bin/bash
echo "# Required" > .env

if [ -z "$DEPLOYMENT_ID" ]; then
  echo "NODE_ENV=development" >> .env
  echo "PORT=3099" >> .env
  echo "SERVER_DATABASE_URL=postgres://root:root@localhost:5442/api" >> .env
  echo "SERVER_AUTHENTICATION_SECRET=your-secret" >> .env
  echo "SERVER_CLIENT_BASE_URL=http://localhost:8099" >> .env
  echo "SERVER_BASE_URL=http://localhost:3099" >> .env

  echo "# Optional" >> .env
  echo "SERVER_OPENAI_API_KEY=" >> .env
  echo "SERVER_GOOGLE_CLIENT_ID=" >> .env
  echo "SERVER_EMAIL_MAILPIT_HOST=" >> .env
  echo "SERVER_EMAIL_MAILPIT_PORT=" >> .env
  echo "SERVER_EMAIL_MAILJET_API_KEY=" >> .env
  echo "SERVER_EMAIL_MAILJET_SECRET_KEY=" >> .env
  echo "SERVER_UPLOAD_AWS_ACCESS_KEY=" >> .env
  echo "SERVER_UPLOAD_AWS_SECRET_KEY=" >> .env
  echo "SERVER_UPLOAD_AWS_BUCKET_PUBLIC_NAME=" >> .env
  echo "SERVER_UPLOAD_AWS_BUCKET_PRIVATE_NAME=" >> .env
  echo "SERVER_UPLOAD_AWS_REGION=" >> .env
  echo "SERVER_UPLOAD_MARBLISM_API_KEY=" >> .env
  echo "SERVER_PAYMENT_STRIPE_SECRET_KEY=" >> .env
  echo "SERVER_PAYMENT_STRIPE_WEBHOOK_SECRET=" >> .env
fi

echo "SERVER_AUTHENTICATION_TOKEN_METHOD=header" >> .env