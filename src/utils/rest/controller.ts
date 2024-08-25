import { NextFunction, Response, Router } from 'express';
import { Formatter } from '../formatter';
import RequestWithUser from './request';
/**
 * Interface defining Controller parameters.
 */
export interface Controller {
  path: string;
  router: Router;
}

export abstract class AbstractController implements Controller {
  public readonly path: string;
  public readonly router: Router = Router();
  protected readonly fmt: Formatter;

  constructor(path: string) {
    this.path = path;
    this.fmt = new Formatter();
  }

  protected abstract initializeRoutes(): void;

  /**
   * Generic async middleware to catch errors
   *
   * @param  {function} fn
   * @param  {RequestWithUser}   req
   * @param  {Response}   res
   */
  protected asyncRouteHandler = (
    fn: (arg0: RequestWithUser, arg1: Response, arg2: NextFunction) => void,
  ) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
