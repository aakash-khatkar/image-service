import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import HttpException from '../exception/HttpException';
import { ErrorCodes } from '../utils/ErrorCode';

/**
 * Middleware to validate the request.
 * Validations are performed using class-validator
 */
function validationMiddleware<T>(
  type: any,
  parameter: string,
  skipMissingProperties = false
): (req: Request, res: Response, next: NextFunction) => void {
  
  return (req: Request, res: Response, next: NextFunction) => {
    const requestValidator = getRequestValidator(parameter, req);
    const requestBody = plainToInstance(type, requestValidator); // Updated to plainToInstance
    validate(requestBody, {
      skipMissingProperties,
      forbidUnknownValues: true,
      whitelist: true,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorDetail = ErrorCodes.VALIDATION_ERROR;
        next(new HttpException(400, errorDetail.MESSAGE, errorDetail.CODE, errors));
      } else {
        if (parameter === 'body') {
          req.body = requestBody;
        }
        next();
      }
    });
  };
}

function getRequestValidator(parameter: string, request: Request) {
  switch (parameter) {
    case 'body':
      return request.body;
    case 'query':
      return request.query;
    case 'params':
      return request.params;
  }
}

export default validationMiddleware;