const fs = require("fs");
const _ = require("highland");
const {
  fetchWithCache,
  createCache,
  wrap,
  extractImportesExports
} = require("./utils");
const cache = createCache("./tmp");
const hooks = require("../hooks.json");

const options = [
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/${name}.js`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/${name}.ts`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/${name}.tsx`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/${name}.jsx`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/hooks/${name}.js`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/hooks/${name}.ts`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/hooks/${name}.tsx`,
    0.9
  ],
  ({ repositoryUrl, name }) => [
    `${repositoryUrl}/raw/master/src/hooks/${name}.jsx`,
    0.9
  ],
  ({ repositoryUrl }) => [`${repositoryUrl}/raw/master/src/index.js`, 0.1],
  ({ repositoryUrl }) => [`${repositoryUrl}/raw/master/src/index.ts`, 0.1],
  ({ repositoryUrl }) => [`${repositoryUrl}/raw/master/index.js`, 0.1],
  ({ repositoryUrl }) => [`${repositoryUrl}/raw/master/index.ts`, 0.1]
];

const guessSource = async hook => {
  const { sourceUrl, name } = hook;
  if (sourceUrl) return hook;

  for (let guess of options) {
    const [url, probability] = guess(hook);

    delete h.sourceUrl;

    const result = await fetchWithCache(url, { cache, cacheErrors: true });
    if (result.status === 200) {
      if (probability >= 0.8) {
        return {
          ...hook,
          sourceUrl: url
        };
      }
      try {
        const { exportedHooks, importedHooks } = extractImportesExports({
          code: result.text,
          filename: url
        });
        if (exportedHooks.length >= 1) {
          if (exportedHooks.includes(name)) {
            return {
              ...hook,
              sourceUrl: url
            };
          } else {
            console.log("Found named imports, but didn't find the name");
          }
        }
        if (importedHooks.filter(([lib]) => lib === "react").length > 0) {
          // default export
          return {
            ...hook,
            sourceUrl: url
          };
        } else {
          console.log(
            `This file doesn't import hooks - probably not a hook or CJS file ${url}`
          );
        }
      } catch (e) {
        console.log(`Can't parse ${url}`);
        console.log(e.message);
      }
    }
  }

  return hook;
};

_(hooks)
  .flatMap(wrap(guessSource))
  .toArray(result =>
    fs.writeFileSync("../hooks.json", JSON.stringify(result, null, 2))
  );
