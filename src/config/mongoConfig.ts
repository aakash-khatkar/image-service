// src/config/mongoConfig.ts
import mongoose from 'mongoose';
import logger from '../logging/logger';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://mongo:27017/image-service';

export const connectToMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the application if the connection fails
  }
};
