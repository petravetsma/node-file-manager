
import {cli} from "./cli.js"

const args = process.argv.find(arg => arg.startsWith("--username="));
const user = args ? args.split("=")[1] : "user";
const res = user.charAt(0).toUpperCase() + user.slice(1);


cli(res);