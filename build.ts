import { build } from "esbuild";
import { builtinModules } from "node:module";
import { resolve } from "node:path";

async function build_actions() {
    const actions = [
        { name: "notify-web" },
        { name: "receive-web" },
        { name: "install-innosetup" },
        { name: "install-ninja" },
    ];

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
                external: [...builtinModules],
            }),
        ),
    );
}

build_actions().catch((err) => {
    console.error(err);
    process.exit(1);
});
