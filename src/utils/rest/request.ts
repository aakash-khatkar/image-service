import { Request } from "express";
import URLParams from "./urlparams";

/**
 * Interface to add extra modifiers to request.
 */
export default interface RequestWithUser extends Request {
  startTime?: number;
  userAgent?: { [key: string]: any };
  searchParams?: URLParams;
}
