import { ImageMetadata } from '../models/ImageModel';
import SearchResult from '../utils/rest/searchResult';

export interface ImageService {
  uploadImage(file: Express.Multer.File): Promise<ImageMetadata>;
  uploadExistingImage(id: string,file: Express.Multer.File): Promise<ImageMetadata>;
  listS3Images():Promise<string[]>;
  getImageMeta(id: string): Promise<ImageMetadata | null>;
  updateImageMeta(id: string, data: Partial<ImageMetadata>): Promise<ImageMetadata | null>;
  getImageFile(imageId: string): Promise<{ fileStream: NodeJS.ReadableStream, image: ImageMetadata }>;
  deleteImage(id: string): Promise<void>;
  listImages(query: any): Promise<SearchResult>;
}