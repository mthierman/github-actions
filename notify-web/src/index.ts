import { getInput } from "@actions/core";
import { Temporal } from "@js-temporal/polyfill";
import { Octokit } from "@octokit/rest";
import { spawnSync } from "node:child_process";

(async () => {
    const event_type = getInput("event_type", { required: true });
    const name = getInput("name", { required: true });
    const version = getInput("version", { required: true });
    const description = getInput("description", { required: true });
    const symbol = getInput("symbol", { required: true });
    const repo = getInput("repo", { required: true });
    const releases = getInput("releases", { required: true });

    const octokit = new Octokit({ auth: process.env.GH_TOKEN });

    await octokit.repos.createDispatchEvent({
        owner: "mthierman",
        repo: "mthierman.pages.dev",
        event_type,
        client_payload: {
            data: {
                name,
                version,
                description,
                repo,
                releases,
                symbol,
                build_time: Temporal.Now.plainDateTimeISO().toString(),
                latest_commit: spawnSync("git", ["rev-parse", "--short", "HEAD"], {
                    encoding: "utf-8",
                }).stdout.trim(),
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
    });
})();
