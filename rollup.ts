import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { resolve } from "node:path";
import { rollup } from "rollup";

const bundle = await rollup({
    input: resolve("notify-web/index.ts"),
    output: { esModule: true, file: "index.js", format: "es", sourcemap: true },
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), typescript()],
});

bundle.write({ dir: "notify-web/dist" });
