/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTestResponse } from "@tkesgar/ariadoa";
import { ErrorRequestHandler } from "express";
import { send, ApiError, ApiStatus } from "..";

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
});
