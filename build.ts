import esbuild from "esbuild";
import { resolve } from "node:path";

await esbuild.build({
    entryPoints: [resolve("notify-web/src/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    outfile: resolve("notify-web/dist/action.cjs"),
});
