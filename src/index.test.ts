import { createTestResponse } from "@tkesgar/ariadoa";
import handle from ".";

describe("handle", () => {
  it("should send data from fn", async () => {
    const { payload } = await createTestResponse([
      handle(() => ({ foo: "bar" })),
    ]);

    expect(JSON.parse(payload)).toEqual({ foo: "bar" });
  });

  it.todo("should continue to next middleware if headers has not been sent");
  it.todo("should not continue to next middleware if headers has been sent");

  describe("with various return value types", () => {
    it.todo("should return JSON object if type = 'object'");
    it.todo("should return JSON number if type = 'number'");
    it.todo("should return JSON string if type = 'string'");
    it.todo("should throw error if type = 'bigint'");
    it.todo("should throw error if type = 'symbol'");
    it.todo("should throw error if type = 'function'");
  });
});
