import esbuild from "esbuild";
import { resolve } from "node:path";

await esbuild.build({
    platform: "node",
    target: "node24",
    format: "esm",
    entryPoints: [resolve("notify-web/action.ts")],
    outfile: resolve("notify-web/dist/action.ts"),
    bundle: true,
    minify: true,
});
