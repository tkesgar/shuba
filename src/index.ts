import { Request, Response, RequestHandler } from "express";

export type HandleFunction<T = void> = (
  req: Request,
  res: Response
) => T | Promise<T>;

export default function handle<T = void>(
  fn: HandleFunction<T>
): RequestHandler {
  return (req, res, next) =>
    (async () => {
      const result = await fn(req, res);

      if (typeof result === "undefined") {
        if (res.headersSent) {
          return;
        }

        next();
      }

      res.send(result);
    })().catch(next);
}
