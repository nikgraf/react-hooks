import hooks from "../../hooks.json";

describe("hooks.json", () => {
  test("no duplicated hooks", () => {
    const findDuplicatedHook = (hooks) => {
      const keys = new Set();
      for (const hook of hooks) {
        const key = `${hook.repositoryUrl}-${hook.name}`;
        if (keys.has(key)) {
          return hook;
        }
        keys.add(key);
      }
      return null;
    };
    expect(
      findDuplicatedHook(hooks)
    ).toBeNull();
  });
});