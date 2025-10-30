import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getInput } from "@actions/core";
import { spawnSync } from "node:child_process";
import * as os from "node:os";
import * as path from "node:path";

(async () => {
    try {
        const version = getInput("version", { required: true });
        const tool_dir = path.join(os.homedir(), ".dotnet", "tools");
        const cache_key = `${os.platform()}-wix-${version}`;
        const restored_key = await cache.restoreCache([tool_dir], cache_key);

        if (restored_key) {
            core.info(`Cache hit for Wix ${version}`);
        } else {
            core.info(`Cache miss, downloading Wix ${version}`);

            const install_wix = spawnSync(
                "dotnet",
                ["tool", "install", "--global", "wix", "--version", `${version}`],
                { stdio: "inherit" },
            );

            if (install_wix.status !== 0) {
                throw new Error(`dotnet tool install failed: ${install_wix.status}`);
            }

            await cache.saveCache([tool_dir], cache_key);
        }

        core.addPath(tool_dir);
        core.info(`Wix ${version} added to PATH`);
    } catch (error: any) {
        core.setFailed(error.message);
    }
})();
