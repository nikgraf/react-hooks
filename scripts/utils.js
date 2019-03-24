const _ = require("highland");
const fetch = require("node-fetch");
// wrap async function into a stream
const wrap = asyncFunction => arg => _(asyncFunction(arg));

const levelup = require("levelup");
const leveldown = require("leveldown");
const encode = require("encoding-down");

createCache = path =>
  levelup(encode(leveldown(path), { valueEncoding: "json" }));

const get = (db, key) =>
  db.get(key).catch(err => {
    if (err.notFound) return undefined;
    else return Promise.reject(err);
  });

const fetchWithCache = async (sourceUrl, { cache, cacheErrors }) => {
  let cacheEntry = await get(cache, sourceUrl);
  if (!cacheEntry) {
    const response = await fetch(sourceUrl);
    const { headers, status } = response;
    if (response.ok) {
      const text = await response.text();
      cacheEntry = {
        text,
        status,
        etag: headers.get("etag"),
        expires: headers.get("expires")
      };
    } else {
      cacheEntry = {
        text: undefined,
        status,
        etag: headers.get("etag"),
        expires: headers.get("expires")
      };
    }
    await cache.put(sourceUrl, cacheEntry);
  } else if (cacheErrors) {
    // do nothing
  } else {
    if (new Date(cacheEntry.expires) > new Date()) {
      // console.log('cache is fresh');
    } else {
      const response = await fetch(sourceUrl);
      const { headers } = response;
      if (headers.get("etag") === cacheEntry.etag) {
        cacheEntry = {
          ...cacheEntry,
          expires: headers.get("expires")
        };
      } else {
        const text = await response.text();
        cacheEntry = {
          text,
          etag: headers.get("etag"),
          expires: headers.get("expires")
        };
      }
      await cache.put(sourceUrl, cacheEntry);
    }
  }

  return cacheEntry;
};

fetchSource = ({ cache }) =>
  wrap(async h => {
    if (!h.sourceUrl) return h;
    const result = await fetchWithCache(h.sourceUrl, { cache });
    h.source = result.text;
    return h;
  });

const isHook = name => name.indexOf("use") === 0;

// this is false for some cases
const isLocal = path => path.indexOf(".") === 0;

const babel = require("@babel/core");

const extractImportesExports = ({
  code,
  parserOpts = {},
  filename = "indexed.js"
}) => {
  const isTypescript = filename.indexOf(".ts") > -1;
  parserOpts = isTypescript
    ? {
        plugins: [["typescript", { isTSX: true }], "dynamicImport"],
        ...parserOpts
      }
    : {
        plugins: ["flow", "jsx", "dynamicImport"],
        ...parserOpts
      };

  const exportedHooks = [];
  const importedHooks = [];
  const localImports = [];
  const npmImports = [];

  const ast = babel.parse(code, {
    filename,
    parserOpts
  });
  const file = new babel.File(parserOpts, { code, ast });

  for (let item of file.path.get("body")) {
    if (item.isExportDeclaration()) {
      let namedExports = [];
      if (item.node.declaration && item.node.declaration.id) {
        namedExports.push(item.node.declaration.id);
      }
      if (item.node.declaration && item.node.declaration.declarations) {
        namedExports = namedExports.concat(item.node.declaration.declarations.map(x => x.id));
      }
      namedExports.forEach(namedExport => {
        if (namedExport && isHook(namedExport.loc.identifierName)) {
          exportedHooks.push(namedExport.loc.identifierName);
        }
      });
    }

    if (item.isImportDeclaration()) {
      const namedImports = item.node.specifiers
        .filter(imp => imp.imported)
        .map(imp => imp.imported)
        .map(namedImport => namedImport.loc.identifierName);

      for (let imp of namedImports) {
        if (isHook(imp)) {
          importedHooks.push([item.node.source.value, imp]);
        } else if (isLocal(item.node.source.value)) {
          localImports.push([item.node.source.value, imp]);
        } else {
          npmImports.push([item.node.source.value, imp]);
        }
      }
    }
  }

  return {
    exportedHooks,
    importedHooks,
    localImports,
    npmImports
  };
};

module.exports = {
  extractImportesExports,
  fetchSource,
  fetchWithCache,
  createCache,
  wrap
};
