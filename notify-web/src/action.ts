// https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action
// https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax#runs
// https://github.com/actions/toolkit
import * as core from "@actions/core";
import { readFileSync } from "node:fs";

try {
    const package_json = JSON.parse(readFileSync("package.json", { encoding: "utf8" }));
    console.dir(package_json, { depth: null });
} catch (error) {
    const err = error as Error;
    core.setFailed(err.message);
}
