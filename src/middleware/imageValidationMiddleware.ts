import { Request, Response, NextFunction } from 'express';
import HttpException from '../exception/HttpException';
import { ErrorCodes } from '../utils/ErrorCode';

/**
 * Middleware to validate the uploaded image.
 * Validates if the file exists and if it is a valid image type.
 */
function imageValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.file) {
    const errorDetail = ErrorCodes.IMAGE_MISSING;
    return next(new HttpException(400,errorDetail.MESSAGE, errorDetail.CODE,));
  }

  const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validMimeTypes.includes(req.file.mimetype)) {
    const errorDetail = ErrorCodes.INVALID_IMAGE;
    return next(new HttpException(400,errorDetail.MESSAGE, errorDetail.CODE,));
  }

  next();
}

export default imageValidationMiddleware;