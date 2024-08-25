import * as express from "express";
import appUtilities from "../utils/appUtilities";

export function queryParamJsonParser(fields: string[]): express.RequestHandler {
  return (req, res, next) => {
    for (const field of fields) {
      appUtilities.parseQueryParam(req, field);
    }
    next();
  };
}
