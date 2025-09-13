import { defineConfig } from "rolldown";

export default defineConfig([
    {
        platform: "node",
        input: "hello-js/action.ts",
        output: {
            file: "hello-js/dist/action.js",
        },
    },
]);
