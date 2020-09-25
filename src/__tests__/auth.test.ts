import { createTestResponse } from "@tkesgar/ariadoa";
import { RequestHandler } from "express";
import { auth, send } from "..";

const setUserToNull: RequestHandler = (req, res, next) => {
  (req as any).user = null;
  next();
};
const setUserToShuba: RequestHandler = (req, res, next) => {
  (req as any).user = {
    id: 123,
    name: "shubashuba",
    displayName: "Subaru",
  };
  next();
};
const handleSuccess: RequestHandler = (req, res) => res.sendStatus(200);

describe("auth", () => {
  it("should return fail 401 AUTH_INVALID response if user does not exist", async () => {
    const { statusCode, payload } = await createTestResponse([
      setUserToNull,
      auth(),
      handleSuccess,
    ]);

    expect(statusCode).toBe(401);
    expect(JSON.parse(payload)).toEqual({
      status: "fail",
      code: "AUTH_INVALID",
      message: "Request is not authenticated",
      data: null,
    });
  });

  it("should return success if authFn is not provided", async () => {
    const { payload } = await createTestResponse([
      setUserToShuba,
      auth(),
      send(({ req }) => (req as any).user),
    ]);

    expect(JSON.parse(payload)).toEqual({
      status: "success",
      data: {
        id: 123,
        name: "shubashuba",
        displayName: "Subaru",
      },
    });
  });

  it("should return fail 403 AUTH_FORBIDDEN response if authFn returns false", async () => {
    const { statusCode, payload } = await createTestResponse([
      setUserToShuba,
      auth(() => Promise.resolve(false)),
      send(({ req }) => (req as any).user),
    ]);

    expect(statusCode).toBe(403);
    expect(JSON.parse(payload)).toEqual({
      status: "fail",
      code: "AUTH_FORBIDDEN",
      message: "User is not authorized",
      data: null,
    });
  });

  it("should continue to next handler if authFn returns true", async () => {
    const { payload } = await createTestResponse([
      setUserToShuba,
      auth(() => Promise.resolve(true)),
      send(({ req }) => (req as any).user),
    ]);

    expect(JSON.parse(payload)).toEqual({
      status: "success",
      data: {
        id: 123,
        name: "shubashuba",
        displayName: "Subaru",
      },
    });
  });

  it("should be able to override function to get user from request", async () => {
    const expectedUser = {
      username: "shubaaa",
    };
    let actualUser = null;

    const { payload } = await createTestResponse([
      setUserToShuba,
      auth(
        ({ user }) => {
          actualUser = user;
          return (user as any).username === "shubaaa";
        },
        {
          getUser() {
            return expectedUser;
          },
        }
      ),
      send(({ req }) => (req as any).user),
    ]);

    expect(actualUser).toEqual(expectedUser);
    expect(JSON.parse(payload)).toEqual({
      status: "success",
      data: {
        id: 123,
        name: "shubashuba",
        displayName: "Subaru",
      },
    });
  });

  it.todo(
    "should be able to override function to return response if user does not exist"
  );
  it.todo(
    "should be able to override function to return response if authFn returns false"
  );
});
