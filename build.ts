import { build } from "esbuild";
import { builtinModules } from "node:module";
import { resolve } from "node:path";

async function buildAll() {
    const nodeBuiltins: string[] = [...builtinModules];

    const actions = [{ name: "notify-web" }, { name: "receive-web" }];

    await Promise.all(
        actions.map((action) =>
            build({
                entryPoints: [resolve(`${action.name}/src/index.ts`)],
                outfile: resolve(`${action.name}/dist/index.cjs`),
                platform: "node",
                target: "node24",
                format: "cjs",
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
