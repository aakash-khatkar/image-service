import express from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { connectToMongo } from './config/mongoConfig';
import logger from './logging/logger';
import errorMiddleware from './middleware/errorMiddleware';
import controllers from './controllers';
import { requestTimeMiddleware } from './middleware/requestTimeMiddleware';
import { s3HealthCheck, ensureBucketExists } from './config/awsConfig';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

app.use(express.json());

// Apply the request time middleware globally
app.use(requestTimeMiddleware);

app.get('/api/health', (req, res) => {
  res.status(200).send('Image service is running');
});

// Load and serve the Swagger UI using js-yaml
const swaggerPath = path.join(__dirname, './config/openapi.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Load all controllers from the controllers index
controllers.forEach((controller) => {
  app.use('/api', controller);
});

// Health check for S3 and bucket creation before starting the server
const startServer = async () => {
  try {
    await connectToMongo();
    await ensureBucketExists(); // Ensure the S3 bucket exists
    await s3HealthCheck(); // Ensure S3 is up before proceeding

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();

// Centralized error handler
app.use(errorMiddleware);