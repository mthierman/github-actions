import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { resolve } from "node:path";
import { rollup } from "rollup";

const notify_web = await rollup({
    input: resolve("notify-web/src/index.ts"),
    output: { esModule: true, file: "index.js", format: "es", sourcemap: true },
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), typescript()],
});

notify_web.write({ dir: "notify-web/dist" });

const receive_web = await rollup({
    input: resolve("receive-web/src/index.ts"),
    output: { esModule: true, file: "index.js", format: "es", sourcemap: true },
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), typescript()],
});

receive_web.write({ dir: "receive-web/dist" });
