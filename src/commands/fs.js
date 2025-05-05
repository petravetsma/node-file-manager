import { resolve, basename } from "path";
import { getAbsPath, getPrevDirectory } from "../tool/util.js";
import fs from 'node:fs/promises'
import { getError } from "../tool/error.js";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "node:stream/promises";

export const cat = (rl, path) => {

    const absPath = getAbsPath(path);
    const readStream = createReadStream(absPath, { encoding: "utf-8" });
    readStream.pipe(process.stdout);
    readStream.on('end', () => {
        console.log('\n +-+-+-+-+-+-END OF FILE+-+-+-+-+-+-');
        rl.prompt();
    });
    readStream.on('error', () => {
        getError();
        rl.prompt();
    });
}

export const add = async (fileName) => {

    const filePath = getAbsPath(fileName);
    await fs.writeFile(filePath, '', { flag: 'wx' });
    console.log('File created successfully!');
}

export const mkdir = async (dirName) => {

    const dirPath = getAbsPath(dirName);
    try {
        await fs.mkdir(dirPath);
        console.log('Directory created successfully!');
    } catch {
        getError();
    }
}

export const rn = async (pathToFile, newFileName) => {

    const absOldPath = getAbsPath(pathToFile)
    const path = getPrevDirectory(absOldPath);
    const absoluteNewPath = resolve(path, newFileName);
    try {
        await fs.rename(absOldPath, absoluteNewPath);
        console.log('File renamed successfully!');
    } catch {
        getError();
    }
}

export const cp = async (pathToFile, pathToNewDir) => {

    await copyFile(pathToFile, pathToNewDir, () => {
        console.log('File copied successfully!')
    });
}

export const mv = async (pathToFile, pathToNewDir) => {

    await copyFile(pathToFile, pathToNewDir, async () => {
        await fs.unlink(getAbsPath(pathToFile));
        console.log('File moved successfully!');
    });
}


export const rm = async (pathToFile) => {

    try {
        await fs.unlink(getAbsPath(pathToFile));
        console.log('File deleted successfully!');
    } catch {
        getError();
    }
}

async function copyFile(pathToFile, pathToNewDir, handlerAfterCP) {

    const absOldPath = getAbsPath(pathToFile);
    const fileName = basename(absOldPath);
    const absNewPath = resolve(pathToNewDir, fileName);
    try {
        await pipeline(createReadStream(absOldPath), createWriteStream(absNewPath),);
        await handlerAfterCP();
    } catch {
        getError();
    }
}