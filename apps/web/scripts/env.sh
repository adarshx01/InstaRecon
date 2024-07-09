#!/bin/bash
  echo "# Required" > .env

if [ -z "$DEPLOYMENT_ID" ]; then
  echo "WEB_PORT=8099" >> .env
  echo "API_BASE_URL=http://localhost:3099" >> .env
fi