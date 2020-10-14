/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { createTestResponse } from "@tkesgar/ariadoa";
import { apiErrorHandler, notFoundHandler, unknownErrorHandler } from "..";
import { handle } from "../handle";
import { ApiError, ApiStatus } from "../api";

describe("notFoundHandler", () => {
  it("should return 404 API response", async () => {
    const { statusCode, payload } = await createTestResponse([
      notFoundHandler(),
    ]);

    expect(statusCode).toBe(404);
    expect(JSON.parse(payload)).toEqual({
      status: "fail",
      code: "NOT_FOUND",
      message: "Resource does not exist",
      data: null,
    });
  });
});

describe("apiErrorHandler", () => {
  it("should return error fail response if fn throws ApiError", async () => {
    const { statusCode, payload } = await createTestResponse([
      handle(() => {
        throw new ApiError("Access to this resource is forbidden", {
          status: ApiStatus.Fail,
          code: "AUTH_FORBIDDEN",
          data: { subaru: "shuba shuba" },
          statusCode: 403,
        });
      }),
      apiErrorHandler(),
    ]);

    expect(statusCode).toBe(403);
    expect(JSON.parse(payload)).toEqual({
      status: "fail",
      code: "AUTH_FORBIDDEN",
      message: "Access to this resource is forbidden",
      data: { subaru: "shuba shuba" },
    });
  });

  it("should fallthrough error if fn throws normal Error", async () => {
    const expectedError = new Error("Oh no");
    let actualError: Error;

    const { statusCode, payload } = await createTestResponse([
      handle(() => {
        throw expectedError;
      }),
      apiErrorHandler(),
      ((err, req, res, next) => {
        actualError = err;
        res.status(502).send(err.message);
      }) as ErrorRequestHandler,
    ]);

    expect(actualError).toBe(expectedError);
    expect(statusCode).toBe(502);
    expect(payload).toBe("Oh no");
  });
});

describe("unknownErrorHandler", () => {
  it("should continue to next error handler if response has been sent", async () => {
    const mockErrorHandler = jest.fn();
    const expectedError = new Error("Oh no");

    const { statusCode, payload } = await createTestResponse([
      handle(({ res }) => {
        res.sendStatus(200);
        throw new Error("Oh no");
      }),
      unknownErrorHandler(),
      ((err, req, res, next) => {
        mockErrorHandler(err);
      }) as ErrorRequestHandler,
    ]);

    expect(statusCode).toBe(200);
    expect(payload).toBe("OK");

    expect(mockErrorHandler).toBeCalledWith(expectedError);
  });

  it("should return internal server error if response has not been sent", async () => {
    const { statusCode, payload } = await createTestResponse([
      handle(() => {
        throw new Error("Oh no");
      }),
      unknownErrorHandler(),
    ]);

    expect(statusCode).toBe(500);
    expect(JSON.parse(payload)).toEqual({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      data: null,
    });
  });
});
