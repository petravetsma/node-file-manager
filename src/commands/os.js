import os from "os";

export const osEOL = () => {

    console.log(`Default system EOL: ${JSON.stringify(os.EOL)}`);
}

export const osCpus = () => {

    const cpus = os.cpus();


    console.log(`\nTotal CPUs: ${cpus.length}`);


    cpus.forEach((cpu, index) => {
        console.log(`\nCPU ${index + 1}:`);
        console.log(`- Model: ${cpu.model}`);
        console.log(`- Clock Rate: ${(cpu.speed / 1000).toFixed(2)} GHz`);
    });
}

export const osHomedir = () => {

    console.log(`Homedir: ${os.homedir()}`);
}

export const osUsername = () => {

    console.log(`Username: ${os.userInfo().username}`);
}

export const osArchitecture = () => {

    console.log(`Architecture: ${os.arch()}`);
}