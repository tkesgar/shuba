import { Request, RequestHandler } from "express";
import { ApiError, createApiSuccess } from "./api";
import { handle } from "./handle";

type SendFunction<T = void> = (ctx: { req: Request }) => T | Promise<T>;

export function send<T = void>(sendFn: SendFunction<T>): RequestHandler {
  return handle(async ({ req, res }) => {
    try {
      const result = await sendFn({ req });
      return createApiSuccess(result ?? null);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode);
        return error;
      }

      throw error;
    }
  });
}
