import {resolve} from "path";
import {changeDir, cwd, getPrevDirectory} from "../tool/util.js";
import fs from 'node:fs/promises'
import {getError} from "../tool/error.js";

export const up = () => {

    const cur = cwd();
    const parentDir = getPrevDirectory(cur);

    if (parentDir !== cur) {
        changeDir(parentDir);
    }
}

export const ls = async () => {

    const cur = cwd();
    const dirs = await fs.readdir(cur);

    const dirsInfo = await Promise.all(
        dirs.map(async (dir) => {
            const absolutePath = resolve(cur, dir);

            const stats = await fs.stat(absolutePath);

            return {
                name: dir,
                type: stats.isDirectory() ? 'directory' : 'file',
            };
        })
    );

    console.table(sortDirectory(dirsInfo));
}

export const cd = async (path) => {

    const abs = resolve(cwd(), path);
    const stats = await fs.stat(abs);

    if (!stats.isDirectory()) {
        getError();
    }
    changeDir(abs);
}

function sortDirectory(dir) {
    return dir.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
}