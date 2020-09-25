/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTestResponse } from "@tkesgar/ariadoa";
import { ErrorRequestHandler } from "express";
import { send, ApiError, ApiCode, ApiStatus } from "..";

describe("send", () => {
  it("should return success response with data", async () => {
    const { payload } = await createTestResponse([
      send(() => ({ foo: "bar" })),
    ]);

    expect(JSON.parse(payload)).toEqual({
      status: "success",
      data: { foo: "bar" },
    });
  });

  it("should return success response with data = null if result is undefined", async () => {
    const { payload } = await createTestResponse([
      send(() => {
        return;
      }),
    ]);

    expect(JSON.parse(payload)).toEqual({
      status: "success",
      data: null,
    });
  });

  it("should return error fail response if fn throws ApiError", async () => {
    const { statusCode, payload } = await createTestResponse([
      send(() => {
        throw new ApiError("Access to this resource is forbidden", {
          status: ApiStatus.Fail,
          code: ApiCode.AuthForbidden,
          data: { subaru: "shuba shuba" },
          statusCode: 403,
        });
      }),
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
      send(() => {
        throw expectedError;
      }),
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
