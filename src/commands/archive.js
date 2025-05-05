import fs from "fs";
import { basename, resolve, extname } from "path";
import { pipeline } from "stream/promises";
import zlib from "zlib";
import { getAbsPath } from "../tool/util.js";
import { getError } from "../tool/error.js";

export const compress = async (pathToFile, pathToDestination) => {
    const sourceFilePath = getAbsPath(pathToFile);
    const fileName = basename(sourceFilePath);
    const toCompressFilePath = resolve(getAbsPath(pathToDestination), `${fileName}.gz`);

    try {
        // STREAM API
        await pipeline(fs.createReadStream(sourceFilePath), zlib.createBrotliCompress(), fs.createWriteStream(toCompressFilePath),);
        console.log("Successfully compressed!");
    } catch {
        getError();
    }
};

export const decompress = async (pathToFile, pathToDestination) => {
    const sourceFilePath = getAbsPath(pathToFile);
    const fileName = basename(sourceFilePath, extname(sourceFilePath));
    const toDecompressedFilePath = resolve(getAbsPath(pathToDestination), fileName);

    try {
        // STREAM API
        await pipeline(fs.createReadStream(sourceFilePath), zlib.createBrotliDecompress(), fs.createWriteStream(toDecompressedFilePath),);
        console.log("Successfully decompressed!");
    } catch {
        getError();
    }
};