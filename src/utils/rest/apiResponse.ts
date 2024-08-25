import { APP_CONSTANTS } from "../../constants";
import { joiErrorResponse } from "./joiErrorResponse";

const headers = {
  "X-Requested-With": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": `OPTIONS, ${process.env.REQUEST_TYPE}`,
};
const getResponseObject = (body: any) => {
  if ("error" in body) {
    if (body.error.isJoi) {
      const response = joiErrorResponse(body.error);
      return response;
    }
    return {
      headers,
      statusCode: body.error.status || 500,
      body: JSON.stringify({
        errors: {
          status: body.error.status,
          errorCode: body.error.errorCode,
          service: APP_CONSTANTS.service,
        },
        message: body.error.message || "Internal Server Error",
      }),
    };
  }
  return {
    headers,
    statusCode: 200,
    body: { data: body },
  };
};

export default {
  getResponseObject,
};
