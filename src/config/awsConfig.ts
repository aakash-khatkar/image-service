// src/config/awsConfig.ts
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
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

export { s3Client  , s3HealthCheck };