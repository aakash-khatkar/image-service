import { Response, NextFunction } from 'express';
import multer from 'multer';
import { AbstractController } from '../utils/rest/controller';
import validationMiddleware from '../middleware/validationMiddleware';
import { ImageDto } from '../dto/ImageDto';
import RequestWithUser from '../utils/rest/request';
import imageValidationMiddleware from '../middleware/imageValidationMiddleware';
import { IdParamsDto } from '../dto/IdParamsDto';
import { APP_CONSTANTS } from '../constants';
import { ImageService } from '../services/ImageService';
import addSearchParams from '../middleware/searchMiddleware';
import { SearchParamsDto } from '../dto/BaseParamsDto';
import { queryParamJsonParser } from '../middleware/queryParamJsonParser';

class ImageController extends AbstractController {
  private imageService: ImageService;
  private upload: multer.Multer;

  constructor(imageService: ImageService) {
    super(`${APP_CONSTANTS.apiPrefix}/images`);
    this.imageService = imageService;
    this.upload = multer();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      this.upload.single('file'),
      imageValidationMiddleware,
      this.asyncRouteHandler(this.uploadImage),
    );

    this.router.put(
      `${this.path}/:id/file`,
      this.upload.single('file'),
      validationMiddleware(IdParamsDto, APP_CONSTANTS.params),
      imageValidationMiddleware,
      this.asyncRouteHandler(this.uploadExistingImage),
    );

    this.router.get(
      `${this.path}/:id/file`,
      validationMiddleware(IdParamsDto, APP_CONSTANTS.params),
      this.asyncRouteHandler(this.getImageFile),
    );
    this.router.get(
      `${this.path}/:id/meta`,
      validationMiddleware(IdParamsDto, APP_CONSTANTS.params),
      this.asyncRouteHandler(this.getImageMeta),
    );
    this.router.put(
      `${this.path}/:id/meta`,
      validationMiddleware(IdParamsDto, APP_CONSTANTS.params),
      validationMiddleware(ImageDto, APP_CONSTANTS.body, true),
      this.asyncRouteHandler(this.updateImageMeta),
    );
    this.router.delete(
      `${this.path}/:id/file`,
      this.asyncRouteHandler(this.deleteImage),
    );
    this.router.get(
      this.path,
      addSearchParams,
      queryParamJsonParser(["tags"]),
      validationMiddleware(SearchParamsDto, APP_CONSTANTS.query),
      this.asyncRouteHandler(this.listImages),
    );
    this.router.get(
      `${this.path}/s3/list`,
      this.asyncRouteHandler(this.listS3Images),
    );
  }

  private uploadImage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await this.imageService.uploadImage(req.file!);
    res.status(201).send(
      this.fmt.formatResponse(
        result,
        Date.now() - req.startTime!,
        'Image uploaded successfully',
      ),
    )
  };

  private uploadExistingImage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await this.imageService.uploadExistingImage(
      req.params.id,
      req.file!,
    );
    res
      .status(201)
      .json(
        this.fmt.formatResponse(
          result,
          Date.now() - req.startTime!,
          'Existing image uploaded successfully',
        ),
      );
  };

  private getImageMeta = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await this.imageService.getImageMeta(req.params.id);
    res
      .status(200)
      .json(
        this.fmt.formatResponse(
          result,
          Date.now() - req.startTime!,
          'Image retrieved successfully',
        ),
      );
  };

  private updateImageMeta = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await this.imageService.updateImageMeta(req.params.id, req.body);
    res
      .status(200)
      .json(
        this.fmt.formatResponse(
          result,
          Date.now() - req.startTime!,
          'Image updated successfully',
        ),
      );
  };

  private deleteImage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    await this.imageService.deleteImage(req.params.id);
    res
      .status(201)
      .json(
        this.fmt.formatResponse(
          null,
          Date.now() - req.startTime!,
          'Image deleted successfully',
        ),
      );
  };

  private listImages = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const { data, total } = await this.imageService.listImages(req.query);
    res
      .status(200)
      .json(
        this.fmt.formatResponse(
          data,
          Date.now() - req.startTime!,
          'Images listed successfully',
          total,
        ),
      );
  };

  private getImageFile = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { fileStream, image } = await this.imageService.getImageFile(req.params.id);
      
      // Set the Content-Disposition header to trigger download with the correct filename
      const filename = `${image.title}`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Set the Content-Type header based on the image's file type
      res.setHeader('Content-Type', image.fileType);
  
      // Pipe the file stream to the response
      fileStream.pipe(res);
    } catch (error) {
      next(error); // Handle error appropriately
    }
  };
  private listS3Images = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const fileNames = await this.imageService.listS3Images();
    res
      .status(200)
      .json(
        this.fmt.formatResponse(
          fileNames,
          Date.now() - req.startTime!,
          'S3 images listed successfully',
        ),
      );
  };
}

export default ImageController;
