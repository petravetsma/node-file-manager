import {isAbsolute, dirname, resolve} from "path";

/**
 * Changes the current directory.
 */
export const changeDir = (targetPath) => {
    return process.chdir(getAbsPath(targetPath));
}

/**
 * Returns the current directory.
 */
export const cwd = () => {
    return process.cwd();
}

/**
 * Returns the previous (parent) directory.
 */
export const getPrevDirectory = (targetPath) => {
    return dirname(targetPath);
}

/**
 * Get the absolute path to the directory.
 */
export const getAbsPath = (targetPath) => {
    return isAbsolute(targetPath) ? targetPath : resolve(cwd(), targetPath);
}