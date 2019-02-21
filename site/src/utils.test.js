import { findHooks, sortHooks } from "./utils";

describe("findHooks", () => {
  test("filter by string", () => {
    expect(
      findHooks("ab", [
        { name: "createBb", repositoryUrl: "" },
        { name: "useAb", repositoryUrl: "" },
        { name: "createCc", repositoryUrl: "" },
        { name: "useZa", repositoryUrl: "" },
        { name: "createAb", repositoryUrl: "" }
      ])
    ).toEqual([
      { name: "useAb", repositoryUrl: "" },
      { name: "createAb", repositoryUrl: "" }
    ]);
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

  test("move hooks with use prefix before others", () => {
    expect(
      sortHooks([
        { name: "createBb" },
        { name: "useAb" },
        { name: "createCc" },
        { name: "useZa" },
        { name: "createA" }
      ])
    ).toEqual([
      { name: "useAb" },
      { name: "useZa" },
      { name: "createA" },
      { name: "createBb" },
      { name: "createCc" }
    ]);
  });
});
