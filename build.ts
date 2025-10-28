import esbuild from "esbuild";
import { resolve } from "node:path";

await esbuild.build({
    entryPoints: [resolve("hello-js/src/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    outfile: resolve("hello-js/action.cjs"),
});

await esbuild.build({
    entryPoints: [resolve("testing-js/src/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    outfile: resolve("testing-js/action.cjs"),
});

await esbuild.build({
    entryPoints: [resolve("notify-web/src/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    outfile: resolve("notify-web/action.cjs"),
});
