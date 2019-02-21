import { lower } from "./utils";

describe("lower", () => {
  test("lowers the string", () => {
    expect(lower("ALERT")).toBe("alert");
  });
});
