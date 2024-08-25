import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { ImageRepository } from '../repositories/ImageRepository';
import { ImageModel, ImageMetadata } from '../models/ImageModel';
import { ImageService } from './ImageService';
import { s3Client } from '../config/awsConfig';
import SearchResult from '../utils/rest/searchResult';
import { ErrorCodes } from '../utils/ErrorCode';
import HttpException from '../exception/HttpException';


export class ImageServiceImpl implements ImageService {
  private s3 = s3Client;
  private bucketName: string;
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.bucketName = process.env.S3_BUCKET_NAME || 'rubber-chickens-bucket';
    this.imageRepository = imageRepository;
  }

  public async uploadImage(file: Express.Multer.File): Promise<ImageMetadata> {
    const hash = this.getHash(file.buffer);

    const existingImage = await this.imageRepository.findImageByHash(hash);
    if (existingImage) {
      const metadata = new ImageModel({
        title: file.originalname,
        description: '',
        lockFile: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        fileUpdatedAt:new Date(),
        fileSize: file.size,
        fileType: file.mimetype,
        fileUrl: existingImage.fileUrl,
        tags: [],
        hash,
      });

      return this.imageRepository.saveImageMetadata(metadata);
    }

    const key = uuidv4();

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    const metadata = new ImageModel({
      title: file.originalname,
      description: '',
      lockFile: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      fileUpdatedAt:new Date(),
      fileSize: file.size,
      fileType: file.mimetype,
      fileUrl: key,
      tags: [],
      hash,
    });

    return this.imageRepository.saveImageMetadata(metadata);
  }

  public async uploadExistingImage(id: string, file: Express.Multer.File): Promise<ImageMetadata> {
    const existingImage = await this.imageRepository.findImageById(id);
    if (!existingImage) {
      const errorDetail = ErrorCodes.IMAGE_NOT_FOUND;
      throw new HttpException(404, errorDetail.MESSAGE, errorDetail.CODE)
    }
  
    if (existingImage.lockFile) {
      const errorDetail = ErrorCodes.IMAGE_IS_LOCKED;
      throw new HttpException(400, errorDetail.MESSAGE, errorDetail.CODE)
    }
  
    const hash = this.getHash(file.buffer);
    const duplicateImage = await this.imageRepository.findImageByHash(hash);
  
    if (duplicateImage) {
      const updatedImage = await this.imageRepository.updateImageMetadata(id, {
        fileUrl: duplicateImage.fileUrl,
        hash,
        fileUpdatedAt: new Date(),
      });
  
      if (existingImage.fileUrl !== duplicateImage.fileUrl) {
        const referenceCount = await this.imageRepository.countReferencesByFileUrl(existingImage.fileUrl);
        if (referenceCount === 1) {
          await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: existingImage.fileUrl }));
        }
      }
  
      return updatedImage!;
    }
  
    const key = existingImage.fileUrl;
  
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });
  
    await upload.done();
  
    const updatedImage = await this.imageRepository.updateImageMetadata(id, {
      fileUrl: key,
      hash,
      fileUpdatedAt: new Date(), // Update modification date
    });
  
    return updatedImage!;
  }

  public async getImageMeta(id: string): Promise<ImageMetadata | null> {
    return this.imageRepository.findImageById(id);
  }


  
    public async updateImageMeta(id: string, data: Partial<ImageMetadata>): Promise<ImageMetadata | null> {
      return this.imageRepository.updateImageMetadata(id, data);
    }

    public async getImageFile(imageId: string): Promise<{ fileStream: NodeJS.ReadableStream, image: ImageMetadata }> {
      const image = await this.imageRepository.findImageById(imageId);
      if (!image) throw new Error('Image not found');
    
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: image.fileUrl,
      });
    
      const data = await this.s3.send(command);
      
      // Return both the file stream and the image metadata
      return { fileStream: data.Body as NodeJS.ReadableStream, image };
    }

  public async deleteImage(id: string): Promise<void> {
    const image = await this.imageRepository.findImageById(id);
    if (!image){
      const errorDetail = ErrorCodes.IMAGE_NOT_FOUND;
      throw new HttpException(404, errorDetail.MESSAGE, errorDetail.CODE)
    }
  
    // Check if the image is locked
    if (image.lockFile) {
      const errorDetail = ErrorCodes.IMAGE_IS_LOCKED;
      throw new HttpException(400, errorDetail.MESSAGE, errorDetail.CODE)
    }
  
    const referenceCount = await this.imageRepository.countReferencesByFileUrl(image.fileUrl);
  
    if (referenceCount === 1) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: image.fileUrl,
      });
      await this.s3.send(deleteCommand);
    }
  
    await this.imageRepository.deleteImageById(id);
  }

  public async listImages(query: any): Promise<SearchResult> {
    return await this.imageRepository.listImages(query);
  }

  public async listS3Images(): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
    });

    const response = await this.s3.send(command);

    const fileNames = response.Contents?.map((item) => item.Key || '') || [];
    return fileNames;
  }

  private getHash(buffer: Buffer): string {
    const hash = createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
  }
}