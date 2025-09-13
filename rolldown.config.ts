import { defineConfig } from "rolldown";

export default defineConfig([
    {
        input: "hello-js/action.ts",
        platform: "node",
        output: {
            file: "hello-js/dist/action.js",
        },
    },
]);
