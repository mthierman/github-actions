import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "hello-js/action.ts",
    output: {
        esModule: true,
        file: "hello-js/dist/action.js",
        format: "es",
        sourcemap: true,
    },
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), typescript()],
};
