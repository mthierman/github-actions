import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getInput } from "@actions/core";
import { execSync, spawnSync } from "node:child_process";
import * as os from "node:os";

(async () => {
    try {
        const version = getInput("version", { required: true });
        const tool_dir = execSync("uv tool dir", { encoding: "utf8" }).trim();
        const cache_key = `${os.platform()}-gersemi-${version}`;
        const restored_key = await cache.restoreCache([tool_dir], cache_key);

        if (!restored_key) {
            const install = spawnSync("uv", ["tool", "install", `gersemi==${version}`], {
                stdio: "inherit",
            });

            if (install.status !== 0) {
                throw new Error(`dotnet tool install failed: ${install.status}`);
            }

            await cache.saveCache([tool_dir], cache_key);
        }

        core.addPath(tool_dir);
        core.info(`Gersemi ${version} added to PATH`);
    } catch (error: any) {
        core.setFailed(error.message);
    }
})();
