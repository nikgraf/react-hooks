const fs = require("fs");
const _ = require("highland");
const { fetchSource, extractImportesExports, createCache } = require("./utils");
const cache = createCache("./tmp");
const hooks = require("../hooks.json");

_(hooks)
  .flatMap(fetchSource({ cache }))
  .map(h => {
    if (!h.source) return h;
    try {
      delete h.subHooks;

      const {
        exportedHooks,
        importedHooks,
        localImports,
        npmImports
      } = extractImportesExports({ code: h.source, filename: h.sourceUrl });

      if (exportedHooks.length > 1) {
        console.warn(`Contains more than one hook ${h.sourceUrl}`);
        delete h.source;
        return h;
      }
      if (importedHooks.length === 0) {
        // warning
      }
      if (localImports === 0) {
        // self contained
      }
      console.log(
        `${h.name} constructed from ${importedHooks.map(x => x[1]).join(", ")}${
          npmImports.length > 0 ? " and " : ""
        }${npmImports.map(x => x[1]).join(", ")}`
      );
      delete h.source;
      return importedHooks.length > 0
        ? {
            ...h,
            subHooks: importedHooks.map(([source, hook]) =>
              source.indexOf(".") === 0 || source === "react"
                ? hook
                : `${source}.${hook}`
            )
          }
        : h;
    } catch (e) {
      console.warn(`Can't parse ${h.sourceUrl}`);
      console.log(e.message);
    }
    delete h.source;
    return h;
  })
  .toArray(result =>
    fs.writeFileSync("../hooks.json", JSON.stringify(result, null, 2))
  );
