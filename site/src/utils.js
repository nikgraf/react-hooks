import Cache from "tmp-cache";

const memoize = fn => {
  const cache = new Cache(300);
  return arg => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
};

const toggle = type => (query, tag) => {
  const index = query.findIndex(
    ([type, term]) => type === type && term.toLowerCase() === tag.toLowerCase()
  );
  if (index > -1) {
    return [...query.slice(0, index), ...query.slice(index + 1)];
  } else {
    return [...query, [type, tag]];
  }
};

const get = ofType => query =>
  query.filter(([type]) => type === ofType).map(([_, term]) => term);

export const getTags = get("tag");
export const toggleTag = toggle("tag");

export const getSubHooks = get("hook");
export const toggleSubHook = toggle("hook");

export const getTerms = get("text");

const unquote = str => str.replace(/^"(.*)"$|/g, "$1").replace('\\"', '"');
const quote = str =>
  str.includes(" ") ? `"${str.replace('"', '\\"')}"` : str.replace('"', '\\"');

// https://stackoverflow.com/questions/13796594/how-to-split-string-into-arguments-and-options-in-javascript
const parseRegexp = /((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|(?:\\\s|\S))+)(?=\s|$)/g;

/**
 * converts input like this
 *
 *   some text "quted text" tag:network tag:"state management"
 *
 * to
 *
 *   [[tesx, some], [text, text], [text, quted text], [tag, network], [tag, state management]]
 */
export const parseSearchString = memoize(query =>
  (query.match(parseRegexp) || []).map(term => {
    const colonPosition = term.indexOf(":");
    if (colonPosition === -1) return ["text", unquote(term)];
    const type = term.substring(0, colonPosition);
    if (type !== "tag" && type !== "hook") return ["text", unquote(term)];
    return [type, unquote(term.substring(colonPosition + 1))];
  })
);

export const searchQueryToString = query => {
  return query
    .map(([type, term]) =>
      type === "text" ? quote(term) : `${type}:${quote(term)}`
    )
    .join(" ");
};

const memoizeSearch = fn => {
  const cache = new Cache(30);
  return (arg, arr) => {
    if (!cache.has(arg)) {
      const query = parseSearchString(arg);
      arg = arg.toLowerCase();

      const texts = query
        .filter(([type]) => type === "text")
        .map(([_, term]) => term);

      let prev = texts.join(" ").substring(0, texts.join(" ").length - 1);
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

export const findHooks = memoizeSearch((search, hooks) => {
  if (search === "") return hooks;
  search = search.toLowerCase();
  const query = parseSearchString(search);
  const tags = getTags(query);
  const subHooks = getSubHooks(query);
  const terms = getTerms(query);

  if (terms.length > 0) {
    hooks = hooks.filter(
      hook =>
        terms.some(term => hook.name.toLowerCase().includes(term)) ||
        terms.some(term => hook.repositoryUrl.toLowerCase().includes(term))
    );
  }

  if (subHooks.length > 0) {
    hooks = hooks
      .filter(hook => Boolean(hook.subHooks))
      .filter(hook =>
        subHooks.every(madeOfHook =>
          hook.subHooks.map(x => x.toLowerCase()).includes(madeOfHook)
        )
      );
  }

  if (tags.length > 0) {
    hooks = hooks.filter(hook =>
      tags.every(tag => hook.tags.map(x => x.toLowerCase()).includes(tag))
    );
  }

  return hooks;
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
  if (githubName(hookA.repositoryUrl) < githubName(hookB.repositoryUrl))
    return -1;
  if (githubName(hookA.repositoryUrl) > githubName(hookB.repositoryUrl))
    return 1;
  return 0;
}

export const sortHooks = hooks => hooks.sort(compare);
