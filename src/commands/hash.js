import {getAbsPath} from "../tool/util.js";
import {createHash} from "crypto";
import fs from "fs";
import {getError} from "../tool/error.js";

export const hash = (rl, pathToFile) => {
    const path = getAbsPath(pathToFile);
    const algorithm = 'sha256';
    const encoding = 'hex';
    const hash = createHash(algorithm);

    const readableStream  = fs.createReadStream(path);

    readableStream.on('data', (chunk) => {
        hash.update(chunk);
    });

    readableStream.on('end', () => {
        const hexHash = hash.digest(encoding);
        console.log(`\nHash: ${hexHash}`);
        console.log(`algorithm: ${algorithm}, encoding: ${encoding}`);
        rl.prompt();
    });

    readableStream.on('error', () => {
        getError();
        rl.prompt();
    });
}