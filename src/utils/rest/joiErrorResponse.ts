import httpStatusCodes from "http-status-codes";
import { APP_CONSTANTS } from "../../constants";
import { ErrorCodes } from "../ErrorCode";
export const joiErrorResponse = (err: any) => {
  const errorDetail = ErrorCodes.VALIDATION_ERROR;
  return {
    statusCode: httpStatusCodes.BAD_REQUEST,
    body: JSON.stringify({
      message: errorDetail.MESSAGE,
      errors: {
        errorCode: errorDetail.CODE,
        service: APP_CONSTANTS.service,
        validationErrors:
          err.details &&
          err.details.map((err: any) => ({
            message: err.message,
            param: err.path,
          })),
      },
    }),
  };
};
