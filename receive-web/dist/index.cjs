"use strict";

// receive-web/src/index.ts
var import_node_child_process = require("node:child_process");
var import_promises = require("node:fs/promises");
var import_node_path = require("node:path");
(async () => {
  const github_event_path = process.env.GITHUB_EVENT_PATH;
  if (!github_event_path) {
    throw new Error("GITHUB_EVENT_PATH not set");
  }
  const event = JSON.parse(await (0, import_promises.readFile)(github_event_path, { encoding: "utf-8" }));
  await (0, import_promises.writeFile)(
    (0, import_node_path.join)((0, import_node_path.resolve)("src/content/projects"), `${event.client_payload.data.name}.json`),
    JSON.stringify(event.client_payload.data, null, 4)
  );
  (0, import_node_child_process.execSync)(
    `git config user.name github-actions[bot] &&
    git config user.email 41898282+github-actions[bot]@users.noreply.github.com &&
    git add -A &&
    (git commit -m 'github-actions: Update generated files' || echo "No changes to commit") &&
    git push origin main`
  );
})();
//# sourceMappingURL=index.cjs.map
