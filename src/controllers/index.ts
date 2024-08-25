import ImageController from './ImageController';
import { ImageServiceImpl } from '../services/ImageServiceImpl';
import { ImageRepository } from '../repositories/ImageRepository';

// If you have other controllers, they would be imported and instantiated here.
const imageRepository = new ImageRepository()
const imageService = new ImageServiceImpl(imageRepository)
export default [
  new ImageController(imageService).router, // You can add more controllers here if needed
];