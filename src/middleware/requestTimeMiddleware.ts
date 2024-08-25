// src/middleware/requestTimeMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../utils/rest/request';

export const requestTimeMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
};