import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "notify-web/src/index.ts",
    output: {
        esModule: true,
        file: "notify-web/dist/index.js",
        format: "es",
        sourcemap: true,
    },
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), typescript()],
};
