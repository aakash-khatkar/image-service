export const ErrorCodes: CustomErrors = {
  SERVICE_CALL_EXCEPTION: {
    CODE: "SERVICE_CALL_EXCEPTION",
    MESSAGE: "Service Call Exception",
  },
  VALIDATION_ERROR: {
    CODE: "VALIDATION_ERROR",
    MESSAGE: "Validation failed error",
  },
  IMAGE_MISSING: {
    CODE: "IMAGE_FILE_MISSING",
    MESSAGE: "Image file is required",
  },
  INVALID_IMAGE: {
    CODE: "INVALID_IMAGE_FILE",
    MESSAGE: "Invalid image type. Only JPEG, PNG, and GIF are allowed.",
  },
  IMAGE_NOT_FOUND: {
    CODE: "IMAGE_NOT_FOUND",
    MESSAGE: "Image not found",
  },
  IMAGE_IS_LOCKED: {
    CODE: "IMAGE_NOT_FOUND",
    MESSAGE: "This image is locked and cannot be deleted or modified",
  }

};

interface CustomErrors {
  [key: string]: CustomError;
}

export interface CustomError {
  CODE: string;
  MESSAGE: string;
}
