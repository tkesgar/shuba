import { Request, RequestHandler } from "express";
import { createApiSuccess } from "./api";
import { handle } from "./handle";

type SendFunction<T = void> = (ctx: { req: Request }) => T | Promise<T>;

export function send<T = void>(sendFn: SendFunction<T>): RequestHandler {
  return handle(async ({ req }) => {
    const result = await sendFn({ req });
    return createApiSuccess(result ?? null);
  });
}
