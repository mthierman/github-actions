import * as core from "@actions/core";
import * as github from "@actions/github";
import { readFileSync } from "node:fs";

try {
    const package_json = core.getInput("package-json", { required: true });
    const content = JSON.parse(readFileSync);
    core.info(`${package_json}`);

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    core.info(`The event payload: ${payload}`);
} catch (error) {
    const err = error as Error;
    core.setFailed(err.message);
}
