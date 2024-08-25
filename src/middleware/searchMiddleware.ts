import { NextFunction, Request, Response } from "express";
import RequestWithUser from "../utils/rest/request";
import logger from "../logging/logger";
import URLParams from "../utils/rest/urlparams";
import { SortOrder } from "../constants/SortOrder";
import { OrderBy } from "../constants/OrderBy";

/**
 * Parse user agent data from header and add to Request
 * @param request
 * @param response
 * @param next
 */
const addSearchParams = (
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) => {
  try {
    const params: URLParams = request.query;
    params.includeDuplicates = params.includeDuplicates === 'true';
    
    if (!params.size) {
      params.size = 25;
    }
    if (!params.offset) {
      params.offset = 0;
    }
    if (!params.tagMatch) {
      params.tagMatch = 'any';
    }
    if (!params.orderBy) {
      params.orderBy = OrderBy.CREATED_AT;
    }
    if (!Object.values(SortOrder).includes(params.sortOrder as SortOrder)) {
      params.sortOrder = SortOrder.DESC;
    }
    request.searchParams = params;
    next();
  } catch (error) {
    logger.warn(`Could not determine user agent`);
    next();
  }
};

export default addSearchParams;