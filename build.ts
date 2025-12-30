import { build } from "esbuild";
import { builtinModules } from "node:module";
import { resolve, dirname } from "node:path";
import { readdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dirs = await readdir(root, { withFileTypes: true });
const actions = dirs
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => name !== "archive")
    .filter((name) => name !== ".git")
    .filter((name) => name !== "node_modules");

await Promise.all(
    actions.map(async (action) => {
        const index = resolve(root, action, "src/index.ts");
        await access(index);
        await build({
            entryPoints: [index],
            outfile: resolve(root, action, "dist/index.cjs"),
            platform: "node",
            target: "node24",
            format: "cjs",
            bundle: true,
            minify: false,
            sourcemap: false,
            external: [...builtinModules],
        });
    }),
).catch((error) => {
    console.error(error);
    process.exit(1);
});
