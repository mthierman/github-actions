import { build } from "esbuild";
import { builtinModules } from "node:module"; // <-- auto-detect built-ins
import { resolve } from "node:path";

async function buildAll() {
    const nodeBuiltins: string[] = [...builtinModules];

    const actions = [
        { name: "notify-web", entry: "notify-web/src/index.ts", outdir: "notify-web/dist" },
        { name: "receive-web", entry: "receive-web/src/index.ts", outdir: "receive-web/dist" },
    ];

    await Promise.all(
        actions.map((action) =>
            build({
                entryPoints: [resolve(action.entry)],
                outfile: resolve(`${action.outdir}/index.js`),
                platform: "node",
                target: "node24",
                format: "esm",
                bundle: true,
                sourcemap: true,
                minify: false,
                external: nodeBuiltins,
            }),
        ),
    );
}

buildAll().catch((err) => {
    console.error(err);
    process.exit(1);
});
