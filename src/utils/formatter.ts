/**
 * Helper functions to standardize responses formats.
 */

import ApiResponse from "./rest/response";


/**
 * Utility class for formatting response
 */
export class Formatter {

  /**
   * Function to format response
   */
  public formatResponse = (result: any, time: number, message?: string, total?: number): ApiResponse => {
    let numRecords: number = 0;
    let errors: Error | null = null;
    let data: any = null;

    if (result && result instanceof Array) {
      numRecords = result.length;
      data = result;
    } else if (result && result instanceof Error) {
      errors = result;
    } else if (result || result === 0) {
      numRecords = 1;
      data = result;
    }

    const response: ApiResponse = {
      data,
      errors,
      message: message ? message : null,
      meta: {
        length: numRecords,
        took: time,
        total: total ? total : numRecords,
      },
    };

    return response;
  }

}
