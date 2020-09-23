export enum ApiStatus {
  Success = "success",
  Fail = "fail",
  Error = "error",
}

export enum ApiCode {
  Failed = "FAILED",
  AuthInvalid = "AUTH_INVALID",
  AuthForbidden = "AUTH_FORBIDDEN",
}

export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  data: T;
  code?: string;
  message?: string;
}

export function createApiSuccess<T = unknown>(data: T = null): ApiResponse<T> {
  return { status: ApiStatus.Success, data };
}

export function createApiFail<T = unknown>(
  code: string,
  message: string,
  data: T = null
): ApiResponse<T> {
  return { status: ApiStatus.Fail, code, message, data };
}

export function createApiError<T = unknown>(
  code: string,
  message: string,
  data: T = null
): ApiResponse<T> {
  return { status: ApiStatus.Error, code, message, data };
}

interface ApiErrorConstructorOpts<T> {
  status?: ApiStatus.Fail | ApiStatus.Error;
  code?: string;
  data?: T;
  statusCode?: number;
}

export class ApiError<T = unknown> extends Error {
  readonly status: ApiStatus.Fail | ApiStatus.Error;
  readonly code: string;
  readonly data: T;
  readonly statusCode: number;

  constructor(message: string, opts: ApiErrorConstructorOpts<T> = {}) {
    const {
      status = ApiStatus.Fail,
      code = ApiCode.Failed,
      data = null,
      statusCode = 400,
    } = opts;

    super(message);

    this.code = code;
    this.status = status;
    this.statusCode = statusCode;
    this.data = data;
  }

  toJSON(): ApiResponse<T> {
    switch (this.status) {
      case ApiStatus.Fail:
        return createApiFail(this.code, this.message, this.data);
      case ApiStatus.Error:
        return createApiError(this.code, this.message, this.data);
      default:
        throw new Error(`Unknown status: ${this.status}`);
    }
  }
}
