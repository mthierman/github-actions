import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

(async () => {
    const github_event_path = process.env.GITHUB_EVENT_PATH;

    if (!github_event_path) {
        throw new Error("GITHUB_EVENT_PATH not set");
    }

    const event = JSON.parse(await readFile(github_event_path, { encoding: "utf-8" }));

    await writeFile(
        join(resolve("src/content/projects"), `${event.client_payload.data.name}.json`),
        JSON.stringify(event.client_payload.data, null, 4),
    );

    spawnSync(
        `git config user.name github-actions[bot] &&
    git config user.email 41898282+github-actions[bot]@users.noreply.github.com &&
    git add -A &&
    (git commit -m 'github-actions: Update generated files' || echo "No changes to commit") &&
    git push origin main`,
    ).stdout;
})();
