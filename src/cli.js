import readline from 'readline';
import os from 'os';
import { cd, ls, up } from "./commands/navigation.js";
import { changeDir, cwd } from "./tool/util.js";
import { getError } from "./tool/error.js";
import { add, cat, cp, mkdir, mv, rm, rn } from "./commands/fs.js";
import { osArchitecture, osCpus, osEOL, osHomedir, osUsername } from "./commands/os.js";
import { hash } from "./commands/hash.js";
import { compress, decompress } from "./commands/archive.js";

const COMMAND_HANDLERS = {
    // Navigation commands
    up: { handler: up, args: 0 },
    cd: { handler: cd, args: 1, needsJoin: true },
    ls: { handler: ls, args: 0 },

    // File system commands
    cat: { handler: cat, args: 1, needsJoin: true, needsRL: true },
    add: { handler: add, args: 1, needsJoin: true },
    mkdir: { handler: mkdir, args: 1, needsJoin: true },
    rn: { handler: rn, args: 2 },
    cp: { handler: cp, args: 2 },
    mv: { handler: mv, args: 2 },
    rm: { handler: rm, args: 1, needsJoin: true },

    // Hash command
    hash: { handler: hash, args: 1, needsJoin: true, needsRL: true },

    // Archive commands
    compress: { handler: compress, args: 2 },
    decompress: { handler: decompress, args: 2 }
};

const OS_COMMAND_HANDLERS = {
    '--EOL': osEOL,
    '--cpus': osCpus,
    '--homedir': osHomedir,
    '--username': osUsername,
    '--architecture': osArchitecture
};

export const cli = (username) => {
    const rl = createReadlineInterface();

    displayWelcomeMessage(username);
    initializeFileManager();

    rl.prompt();

    rl.on('line', async (line) => {
        await handleUserInput(rl, line, username);
        rl.prompt();
        printCurrentDirectory();
    });

    rl.on('close', async (line) => {
        await handleUserInput(rl, line, username);
        printCurrentDirectory();
    });

    rl.on('SIGINT', () => {
        exit(rl, username)
    });
};

function createReadlineInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>>> ',
    });
}

function displayWelcomeMessage(username) {
    console.log(`Welcome to the File Manager, ${username}!`);
}

function initializeFileManager() {
    changeDir(os.homedir());

    printCurrentDirectory();
}

async function handleUserInput(rl, input, username) {
    const [baseCommand, ...args] = input.trim().split(' ');

    if (!baseCommand) return;

    try {
        if (baseCommand === '.exit') {
            exit(rl, username);
            return;
        }

        if (baseCommand === 'os') {
            handleOsCommand(args);
            return;
        }

        await handleRegularCommand(rl, baseCommand, args);
    } catch (error) {
        getError();
        console.error(error.message);
    }
}

function handleOsCommand(args) {
    const [subCommand] = args;
    const handler = OS_COMMAND_HANDLERS[subCommand];

    if (handler) {
        handler();
    } else {
        console.error('Invalid input');
    }
}

async function handleRegularCommand(rl, command, args) {
    const commandConfig = COMMAND_HANDLERS[command];

    if (!commandConfig) {
        console.error('Invalid input');
        return;
    }

    if (args.length < commandConfig.args) {
        console.error(`Error: ${command} requires ${commandConfig.args} arguments`);
        return;
    }

    const processedArgs = commandConfig.needsJoin ?
        [args.join(' ')] :
        args.slice(0, commandConfig.args);

    if (commandConfig.needsRL) {
        processedArgs.unshift(rl);
    }

    await commandConfig.handler(...processedArgs);
}

export function printCurrentDirectory() {
    console.log(`\nYou are currently in ${cwd()}`);
}

function exit(rl, username) {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.close();
    process.exit(0);
}
