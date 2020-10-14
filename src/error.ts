import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from "express";
import { createApiFail, createApiError, ApiError } from "./api";
import { handle } from "./handle";

export function notFoundHandler(): RequestHandler {
  return handle(({ res }) => {
    res.status(404).send(createApiFail("NOT_FOUND", "Resource does not exist"));
  });
}

export function apiErrorHandler(): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json(err);
      return;
    }

    next(err);
  };
}

export function unknownErrorHandler(): ErrorRequestHandler {
  return (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (res.headersSent) {
      next(err);
      return;
    }

    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  };
}
