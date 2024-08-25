#!/bin/bash
if [ -f .env ]; then
  echo ".env file already exists. Skipping generation."
else
  cat <<EOF > .env
PORT=3000
MONGO_URI=mongodb://mongo:27017/image-service
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
S3_BUCKET_NAME=rubber-chickens-bucket
AWS_ENDPOINT=http://localstack:4566
EOF
  echo ".env file generated."
fi