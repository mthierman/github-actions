import esbuild from "esbuild";
import { resolve } from "node:path";

await esbuild.build({
    entryPoints: [resolve("notify-web/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "esm",
    sourcemap: true,
    outfile: resolve("notify-web/dist/action.js"),
});
