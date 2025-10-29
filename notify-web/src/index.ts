import { getInput } from "@actions/core";
import { Temporal } from "@js-temporal/polyfill";
import { Octokit } from "@octokit/rest";
import { execSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

(async () => {
    const package_json = JSON.parse(
        readFileSync(resolve(import.meta.dirname, "package.json"), { encoding: "utf-8" }),
    );
    const event_type = getInput("event_type", { required: true });

    const octokit = new Octokit({ auth: process.env.GH_TOKEN });

    await octokit.repos.createDispatchEvent({
        owner: "mthierman",
        repo: "mthierman.pages.dev",
        event_type,
        client_payload: {
            data: {
                name: package_json.name,
                version: package_json.version,
                description: package_json.description,
                symbol: package_json.symbol,
                homepage: package_json.homepage,
                repository: package_json.repository.url,
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
