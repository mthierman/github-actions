import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getInput } from "@actions/core";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as https from "node:https";
import * as os from "node:os";
import { join } from "node:path";

function download_file(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https
            .get(url, (res) => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
                }
                res.pipe(file);
                file.on("finish", () =>
                    file.close((err) => {
                        if (err) return reject(err);
                        resolve();
                    }),
                );
            })
            .on("error", (err) => {
                fs.unlinkSync(dest);
                reject(err);
            });
    });
}

(async () => {
    try {
        const version = getInput("version", { required: true });
        const workspace = process.cwd();
        const install_dir = join(workspace, `ninja-${version}`);
        const cache_key = `${os.platform()}-ninja-${version}`;
        const restored_key = await cache.restoreCache([install_dir], cache_key);

        if (restored_key) {
            core.info(`Cache hit for Ninja ${version}`);
        } else {
            core.info(`Cache miss, downloading Ninja ${version}`);
        }

        let platform: string;
        switch (os.platform()) {
            case "win32":
                platform = "win";
                break;
            case "linux":
                platform = "linux";
                break;
            case "darwin":
                platform = "mac";
                break;
            default:
                throw new Error(`Unsupported OS: ${os.platform()}`);
        }

        const zip_path = join(workspace, `ninja-${platform}.zip`);

        await download_file(
            `https://github.com/ninja-build/ninja/releases/download/v${version}/ninja-${platform}.zip`,
            zip_path,
        );

        fs.mkdirSync(install_dir, { recursive: true });

        const extract_result = spawnSync("7z", ["x", zip_path, `-o${install_dir}`, "-y"], {
            stdio: "inherit",
        });

        if (extract_result.error) {
            throw extract_result.error;
        }
        if (extract_result.status !== 0) {
            throw new Error(`7-Zip extraction failed with code ${extract_result.status}`);
        }

        fs.rmSync(zip_path);

        await cache.saveCache([install_dir], cache_key);

        core.addPath(install_dir);
        core.info(`Ninja ${version} added to PATH`);
    } catch (error: any) {
        core.setFailed(error.message);
    }
})();
