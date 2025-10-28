import esbuild from "esbuild";
import { resolve } from "node:path";

await esbuild.build({
    entryPoints: [resolve("testing-js/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    outfile: resolve("testing-js/dist/action.cjs"),
});

await esbuild.build({
    entryPoints: [resolve("hello-js/action.ts")],
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    outfile: resolve("hello-js/dist/action.cjs"),
});
