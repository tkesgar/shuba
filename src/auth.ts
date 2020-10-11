import { Request, Response, RequestHandler } from "express";
import { createApiFail } from "./api";
import { handle } from "./handle";

type AuthFunction<T> = (ctx: {
  req: Request;
  user: T;
}) => boolean | Promise<boolean>;

interface AuthOpts<T> {
  getUser?(req: Request): T | Promise<T>;
  onInvalid?(ctx: { req: Request; res: Response }): unknown;
  onForbidden?(ctx: { req: Request; res: Response; user: T }): unknown;
}

export function auth<T = unknown>(
  authFn?: AuthFunction<T>,
  opts: AuthOpts<T> = {}
): RequestHandler {
  const {
    getUser = (req): T => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (req as any).user as T;
    },
    onInvalid = ({ res }) => {
      res.status(401);
      return createApiFail("AUTH_INVALID", "Request is not authenticated");
    },
    onForbidden = ({ res }) => {
      res.status(403);
      return createApiFail("AUTH_FORBIDDEN", "User is not authorized");
    },
  } = opts;

  return handle(async ({ req, res }) => {
    const user = await getUser(req);
    if (!user) {
      return onInvalid({ req, res });
    }

    if (!authFn) {
      return;
    }

    const authResult = await authFn({ req, user });
    if (!authResult) {
      return onForbidden({ req, res, user });
    }
  });
}
