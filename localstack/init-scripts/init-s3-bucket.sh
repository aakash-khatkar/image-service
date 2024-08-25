#!/bin/sh

# Set AWS credentials and region for LocalStack
aws configure set aws_access_key_id test --profile localstack
aws configure set aws_secret_access_key test --profile localstack
aws configure set region us-east-1 --profile localstack

# Check if the S3 bucket already exists
if awslocal s3 ls | grep -q 'rubber-chickens-bucket'; then
  echo "Bucket 'rubber-chickens-bucket' already exists. Skipping creation."
else
  # Create the S3 bucket using the dummy profile
  echo "Creating bucket 'rubber-chickens-bucket'..."
  awslocal s3 mb s3://rubber-chickens-bucket
fi