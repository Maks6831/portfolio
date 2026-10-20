// Shared plumbing for the component render tests (check-decisions, check-payments, check-testing, check-assistant,
// check-toc and check-links): transpile a few source files to plain ESM and render them with react-dom/server. No
// browser, no test framework.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Transpile `files` ({ "src/path.tsx": "Emitted.js" }) into a cache folder under node_modules so `react`,
 * `clsx` and `tailwind-merge` resolve as usual. `@/` aliases are rewritten through `aliases` to sibling files;
 * type-only imports are elided by the transpiler. Returns a loader for the emitted modules' exports: the default
 * export unless another export is named.
 */
export const compileComponents = ({ cacheName, aliases, files }) => {
  const outDir = join(root, "node_modules", ".cache", cacheName);
  mkdirSync(outDir, { recursive: true });
  for (const [rel, name] of Object.entries(files)) {
    const source = readFileSync(join(root, rel), "utf8");
    const { outputText, diagnostics } = ts.transpileModule(source, {
      fileName: rel,
      reportDiagnostics: true,
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    });
    if (diagnostics?.length) throw new Error(`${rel}: ${diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("; ")}`);
    const js = outputText.replace(/from "(@\/[^"]+)"/g, (m, spec) => {
      if (!aliases[spec]) throw new Error(`${rel}: unmapped alias import ${spec}`);
      return `from "${aliases[spec]}"`;
    });
    writeFileSync(join(outDir, name), js);
  }
  return {
    load: async (name, exportName = "default") => (await import(pathToFileURL(join(outDir, name)).href))[exportName],
  };
};

/** `render(h(Component, props))` -> static HTML string, plus a tiny failure collector. */
export const renderTools = async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement: h } = await import("react");
  const failures = [];
  return {
    h,
    render: (el) => renderToStaticMarkup(el),
    count: (html, re) => (html.match(re) ?? []).length,
    failures,
    check: (ok, msg) => { if (!ok) failures.push(msg); },
  };
};
