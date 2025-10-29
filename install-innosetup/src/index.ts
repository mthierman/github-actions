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
        const install_dir = join(workspace, `innosetup-${version}`);
        const cache_key = `${os.platform()}-innosetup-${version}`;
        const restored_key = await cache.restoreCache([install_dir], cache_key);

        if (restored_key) {
            core.info(`Cache hit for Inno Setup ${version}`);
        } else {
            core.info(`Cache miss, downloading Inno Setup ${version}`);
        }

        const installer_path = join(workspace, `innosetup-${version}.exe`);

        await download_file(
            `https://files.jrsoftware.org/is/6/innosetup-${version}.exe`,
            installer_path,
        );

        spawnSync(installer_path, ["/VERYSILENT", "/CURRENTUSER", `/DIR=${install_dir}`], {
            stdio: "inherit",
        });

        fs.rmSync(installer_path);

        await cache.saveCache([install_dir], cache_key);

        core.addPath(install_dir);
        core.info(`Inno Setup ${version} added to PATH`);
    } catch (error: any) {
        core.setFailed(error.message);
    }
})();
