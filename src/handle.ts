import { Request, Response, RequestHandler } from "express";

export type HandleFunction<T = void> = (ctx: {
  req: Request;
  res: Response;
}) => T | Promise<T>;

export function handle<T = void>(fn: HandleFunction<T>): RequestHandler {
  return (req, res, next) =>
    (async () => {
      const result = await fn({ req, res });

      switch (typeof result) {
        case "undefined":
          if (res.headersSent) {
            return;
          }

          next();
          break;
        case "object":
        case "boolean":
        case "number":
          res.json(result);
          break;
        case "bigint":
        case "symbol":
        case "function":
          throw new Error(
            `Unsupported handle return value type: ${typeof result}`
          );
        case "string":
        default:
          res.send(result);
          break;
      }
    })().catch(next);
}
