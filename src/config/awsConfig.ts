// src/config/awsConfig.ts
import {
  S3Client,
  ListBucketsCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import logger from '../logging/logger';

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT || 'http://localstack:4566',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
});

// Health check function for S3
const s3HealthCheck = async (): Promise<void> => {
  try {
    await s3Client.send(new ListBucketsCommand({}));
    logger.info('Connected to S3 successfully');
  } catch (error) {
    logger.error('Failed to connect to S3:', error);
    throw new Error('S3 health check failed');
  }
};

// Ensure the bucket exists
const ensureBucketExists = async (): Promise<void> => {
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error(
      'S3_BUCKET_NAME is not defined in the environment variables',
    );
  }

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    logger.info(`Bucket "${bucketName}" already exists`);
  } catch (error: any) {
    if (error.name === 'NotFound') {
      logger.info(`Bucket "${bucketName}" does not exist. Creating...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      logger.info(`Bucket "${bucketName}" created successfully`);
    } else {
      logger.error('Error checking or creating bucket:', error);
      throw new Error('Failed to ensure bucket exists');
    }
  }
};

export { s3Client, s3HealthCheck, ensureBucketExists };
