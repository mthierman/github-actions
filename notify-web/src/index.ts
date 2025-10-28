// https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action
// https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax#runs
// https://github.com/actions/toolkit
import * as core from "@actions/core";
import { Temporal } from "@js-temporal/polyfill";
import { Octokit } from "@octokit/rest";
import { spawnSync } from "node:child_process";

(async () => {
    const name = core.getInput("name", { required: true });
    const description = core.getInput("description", { required: true });
    const version = core.getInput("version", { required: true });
    const repo = core.getInput("repo", { required: true });
    const releases = core.getInput("releases", { required: true });
    const event_type = core.getInput("event_type", { required: true });

    const event = {
        event_type: event_type,
        client_payload: {
            data: {
                name: name,
                version: version,
                description: description,
                build_time: Temporal.Now.plainDateTimeISO().toString(),
                latest_commit: spawnSync("git", ["rev-parse", "--short", "HEAD"], {
                    encoding: "utf-8",
                }).stdout.trim(),
                symbol: "🪟",
                repo: repo,
                releases: releases,
                recent_commits: spawnSync(
                    "git",
                    ["log", "-5", "--pretty=format:%h%x00%an%x00%aI%x00%s%x00"],
                    {
                        encoding: "utf-8",
                    },
                )
                    .stdout.split("\n")
                    .filter(Boolean)
                    .map((line) => {
                        const [commit, author, date, message] = line.split("\x00");
                        return { commit, author, date, message };
                    }),
            },
        },
    };

    // https://docs.github.com/en/rest/guides/scripting-with-the-rest-api-and-javascript?apiVersion=2022-11-28
    const octokit = new Octokit({ auth: process.env.GH_TOKEN });
    await octokit.repos.createDispatchEvent({
        owner: "mthierman",
        repo: "mthierman.pages.dev",
        ...event,
    });
})();
