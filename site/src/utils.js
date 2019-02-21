import Cache from "tmp-cache";

const memoize = fn => {
  const cache = new Cache(300);
  return arg => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
};

const memoizeSearch = fn => {
  const cache = new Cache(30);
  return (arg, arr) => {
    if (!cache.has(arg)) {
      const prev = arg.substring(0, arg.length - 1);
      if (cache.has(prev)) {
        cache.set(arg, fn(arg, cache.get(prev)));
      } else {
        cache.set(arg, fn(arg, arr));
      }
    }
    return cache.get(arg);
  };
};

export const githubName = memoize(link =>
  link.replace(/^https:\/\/github.com\//, "")
);

const lowerArray = memoize(tags => tags.map(tag => tag.toLowerCase()));

export const findHooks = memoizeSearch((term, hooks) => {
  if (term === "") return hooks;
  if (term === "#")
    return hooks.filter(hook => hook.tags && hook.tags.length > 0);
  if (term[0] === "#") {
    const tagToSearch = term.substring(1).toLowerCase();
    return hooks.filter(hook =>
      lowerArray(hook.tags).some(tag => tag.includes(tagToSearch))
    );
  }
  return hooks.filter(
    hook =>
      hook.name.toLowerCase().includes(term.toLowerCase()) ||
      hook.repositoryUrl.toLowerCase().includes(term.toLowerCase())
  );
});

function compare(hookA, hookB) {
  if (
    hookA.name.substring(0, 3) === "use" &&
    hookB.name.substring(0, 3) !== "use"
  ) {
    return -1;
  }
  if (
    hookB.name.substring(0, 3) === "use" &&
    hookA.name.substring(0, 3) !== "use"
  ) {
    return 1;
  }
  if (hookA.name < hookB.name) return -1;
  if (hookA.name > hookB.name) return 1;
  return 0;
}

export const sortHooks = hooks => hooks.sort(compare);
