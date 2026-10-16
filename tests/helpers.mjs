import { readFileSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
export function load(path, dependencies = {}) {
  const file = resolve(root, path.startsWith("../") ? path.slice(3) : path);
  const source = readFileSync(file, "utf8");
  if (file.endsWith(".json")) return JSON.parse(source);
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } });
  const loaded = { exports: {} };
  const require = createRequire(file);
  new Function("require", "module", "exports", outputText)((name) => {
    if (name in dependencies) return dependencies[name];
    if (name.startsWith(".") || name.startsWith("@/")) {
      const target = name.startsWith("@/") ? resolve(root, "src", name.slice(2)) : resolve(dirname(file), name);
      const resolved = [target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`].find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
      if (resolved) return load(resolved, dependencies);
    }
    return require(name);
  }, loaded, loaded.exports);
  return loaded.exports;
}
