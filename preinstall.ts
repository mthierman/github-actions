import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const hooks_dir = resolve(".git/hooks");
const pre_commit = join(hooks_dir, "pre-commit");

const hook_content = `#!/bin/sh
echo "Building GitHub action..."
pnpm build || exit 1
git add -A`;

try {
    mkdirSync(hooks_dir, { recursive: true });
    writeFileSync(pre_commit, hook_content, { encoding: "utf8" });
} catch (err) {
    console.error(`Failed to install pre-commit hook: ${err}`);
    process.exit(1);
}
