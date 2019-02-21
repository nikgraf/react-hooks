import { lower, sortHooks } from "./utils";

describe("lower", () => {
  test("lowers the string", () => {
    expect(lower("ALERT")).toBe("alert");
  });
});

describe("sortHooks", () => {
  test("sorts hooks alphabetically", () => {
    expect(
      sortHooks([
        { name: "dd" },
        { name: "aa" },
        { name: "ca" },
        { name: "ab" }
      ])
    ).toEqual([{ name: "aa" }, { name: "ab" }, { name: "ca" }, { name: "dd" }]);
  });
});
