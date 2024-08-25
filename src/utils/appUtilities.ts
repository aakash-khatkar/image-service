import express from "express";
import ValidationException from "../exception/ValidationException";

const parseQueryParam = (req: express.Request, key: string) => {
  try {
    const queryParam = req.query[key];

    // Only parse if the queryParam exists and is a non-empty string
    if (queryParam && typeof queryParam === 'string') {
      req.query[key] = JSON.parse(queryParam);
    }
  } catch (error) {
    throw new ValidationException([
      {
        property: key,
        constraints: { ids: "Invalid JSON" },
        children: [],
      },
    ]);
  }
};

export default {
  parseQueryParam,
};