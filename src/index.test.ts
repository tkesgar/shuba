import {
  ErrorRequestHandler,
  RequestHandler,
  Request,
  Response,
} from "express";
import { createTestResponse } from "@tkesgar/ariadoa";
import { handle } from ".";

describe("handle", () => {
  it("should be sent the same request and response object", async () => {
    let expectedReq: Request;
    let expectedRes: Response;
    let actualReq: Request;
    let actualRes: Response;

    await createTestResponse([
      ((req, res, next) => {
        expectedReq = req;
        expectedRes = res;
        next();
      }) as RequestHandler,
      handle(({ req, res }) => {
        actualReq = req;
        actualRes = res;
        return true;
      }),
    ]);

    expect(actualReq).toBe(expectedReq);
    expect(actualRes).toBe(expectedRes);
  });

  it("should send data from fn", async () => {
    const { payload } = await createTestResponse([
      handle(() => ({ foo: "bar" })),
    ]);

    expect(JSON.parse(payload)).toEqual({ foo: "bar" });
  });

  it("should continue to next middleware if headers has not been sent", async () => {
    const { payload } = await createTestResponse([
      handle(({ res }) => {
        res.locals.shuba = "shuba shuba shuba";
      }),
      ((req, res) => {
        res.send(res.locals.shuba);
      }) as RequestHandler,
    ]);

    expect(payload).toBe("shuba shuba shuba");
  });

  it("should not continue to next middleware if headers has been sent", async () => {
    const { payload } = await createTestResponse([
      handle(({ res }) => {
        res.send("subaru wa warukunai yo");
      }),
      ((req, res) => {
        res.send("watame wa warukunai yo");
      }) as RequestHandler,
    ]);

    expect(payload).toBe("subaru wa warukunai yo");
  });

  describe("with various return value types", () => {
    it("should return JSON object if type = 'object'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return { foo: "bar" };
        }),
      ]);

      expect(response.headers["content-type"]).toContain("application/json");
      expect(JSON.parse(response.payload)).toEqual({ foo: "bar" });
    });

    it("should return JSON number if type = 'number'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return 123456;
        }),
      ]);

      expect(response.headers["content-type"]).toContain("application/json");
      expect(JSON.parse(response.payload)).toBe(123456);
    });

    it("should return JSON boolean if type = 'boolean'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return true;
        }),
      ]);

      expect(response.headers["content-type"]).toContain("application/json");
      expect(JSON.parse(response.payload)).toBe(true);
    });

    it("should return string if type = 'string'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return "<h1>Hello world!</h1><p>It works!</p>";
        }),
      ]);

      expect(response.headers["content-type"]).toContain("text/html");
      expect(response.payload).toBe("<h1>Hello world!</h1><p>It works!</p>");
    });

    it("should throw error if type = 'bigint'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return BigInt("0xffffffffffffffffffffffffffffffff");
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ((err, req, res, next) => {
          res.send(err.message);
        }) as ErrorRequestHandler,
      ]);

      expect(response.payload).toBe(
        "Unsupported handle return value type: bigint"
      );
    });

    it("should throw error if type = 'symbol'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return Symbol("SHUBA SHUBA SHUBA");
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ((err, req, res, next) => {
          res.send(err.message);
        }) as ErrorRequestHandler,
      ]);

      expect(response.payload).toBe(
        "Unsupported handle return value type: symbol"
      );
    });

    it("should throw error if type = 'function'", async () => {
      const response = await createTestResponse([
        handle(() => {
          return function () {
            return "foo";
          };
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ((err, req, res, next) => {
          res.send(err.message);
        }) as ErrorRequestHandler,
      ]);

      expect(response.payload).toBe(
        "Unsupported handle return value type: function"
      );
    });

    it("should await for Promise and return the resolved value", async () => {
      const response = await createTestResponse([
        handle(() => {
          return Promise.resolve({ foo: "bar" });
        }),
      ]);

      expect(JSON.parse(response.payload)).toEqual({ foo: "bar" });
    });

    it("should await for Promise and throw the rejected error", async () => {
      const expectedError = new Error("watame wa warukunai yo ne");
      let actualError: typeof expectedError;

      const response = await createTestResponse([
        handle(() => {
          return Promise.reject(expectedError);
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ((err, req, res, next) => {
          actualError = expectedError;
          res.send(err.message);
        }) as ErrorRequestHandler,
      ]);

      expect(actualError).toEqual(expectedError);
      expect(response.payload).toBe("watame wa warukunai yo ne");
    });
  });
});
