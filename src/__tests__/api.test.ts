import { createApiSuccess, createApiFail, createApiError } from "..";
import { ApiCode, ApiError, ApiStatus } from "../api";

describe("createSuccess", () => {
  it("should return success object with null data by default", () => {
    const apiResponse = createApiSuccess();

    expect(apiResponse).toEqual({
      status: ApiStatus.Success,
      data: null,
    });
  });

  it("should return success object with data", () => {
    const apiResponse = createApiSuccess({ subaru: "shuba shuba shuba" });

    expect(apiResponse).toEqual({
      status: ApiStatus.Success,
      data: { subaru: "shuba shuba shuba" },
    });
  });
});

describe("createFail", () => {
  it("should return fail object with null data by default", () => {
    const apiResponse = createApiFail(
      "ILLEGAL_STATE",
      "Resource is in invalid state"
    );

    expect(apiResponse).toEqual({
      status: ApiStatus.Fail,
      code: "ILLEGAL_STATE",
      message: "Resource is in invalid state",
      data: null,
    });
  });

  it("should return fail object with data", () => {
    const apiResponse = createApiFail(
      "ILLEGAL_STATE",
      "Resource is in invalid state",
      { subaru: "shuba shuba shuba" }
    );

    expect(apiResponse).toEqual({
      status: ApiStatus.Fail,
      code: "ILLEGAL_STATE",
      message: "Resource is in invalid state",
      data: { subaru: "shuba shuba shuba" },
    });
  });
});

describe("createError", () => {
  it("should return error object with null data by default", () => {
    const apiResponse = createApiError(
      "UPSTREAM_ERROR",
      "Upstream resource returns error"
    );

    expect(apiResponse).toEqual({
      status: ApiStatus.Error,
      code: "UPSTREAM_ERROR",
      message: "Upstream resource returns error",
      data: null,
    });
  });

  it("should return error object with data", () => {
    const apiResponse = createApiError(
      "UPSTREAM_ERROR",
      "Upstream resource returns error",
      { subaru: "shuba shuba shuba" }
    );

    expect(apiResponse).toEqual({
      status: ApiStatus.Error,
      code: "UPSTREAM_ERROR",
      message: "Upstream resource returns error",
      data: { subaru: "shuba shuba shuba" },
    });
  });
});

describe("ApiError", () => {
  it("should return ApiError with default values", () => {
    const err = new ApiError("Bad API request");

    expect(err.message).toBe("Bad API request");
    expect(err.status).toBe(ApiStatus.Fail);
    expect(err.code).toBe(ApiCode.Failed);
    expect(err.statusCode).toBe(400);
    expect(err.data).toEqual(null);
  });

  it("should return ApiError with custom values", () => {
    const err = new ApiError("Database unavailable", {
      status: ApiStatus.Error,
      statusCode: 500,
      code: "DB_ERROR",
      data: { subaru: "shuba shuba shuba" },
    });

    expect(err.message).toBe("Database unavailable");
    expect(err.status).toBe(ApiStatus.Error);
    expect(err.code).toBe("DB_ERROR");
    expect(err.statusCode).toBe(500);
    expect(err.data).toEqual({ subaru: "shuba shuba shuba" });
  });

  it("should return fail object if ApiError with status = fail is serialized into JSON", () => {
    const err = new ApiError("Bad API request");

    expect(JSON.parse(JSON.stringify(err))).toEqual({
      status: ApiStatus.Fail,
      code: ApiCode.Failed,
      message: "Bad API request",
      data: null,
    });
  });

  it("should return error object if ApiError with status = error is serialized into JSON", () => {
    const err = new ApiError("Database unavailable", {
      status: ApiStatus.Error,
      statusCode: 500,
      code: "DB_ERROR",
      data: { subaru: "shuba shuba shuba" },
    });

    expect(JSON.parse(JSON.stringify(err))).toEqual({
      status: ApiStatus.Error,
      code: "DB_ERROR",
      message: "Database unavailable",
      data: { subaru: "shuba shuba shuba" },
    });
  });
});
