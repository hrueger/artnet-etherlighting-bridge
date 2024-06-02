// @ts-check
import * as d from "dotenv";
d.config();
import * as childProcess from "child_process";
import { dmxnet } from "dmxnet";

console.log('Connecting to switch...')
const ssh = childProcess.spawn('sshpass', ['-p', process.env.PASSWORD||"", 'ssh', "-o", "StrictHostKeyChecking=no", `${process.env.USERNAME}@${process.env.SWITCH_IP}`], {
    stdio: "pipe",
});



console.log('Connected to switch')
ssh.stdin.write("echo \"0\" > /proc/led/led_mode\n");

process.on('SIGINT', async () => {
    console.log('Closing connection to switch...')
    ssh.kill();
    process.exit()
})

// const colors = [
//     [255, 0, 0],
//     [0, 255, 0],
//     [0, 0, 255],
//     [255, 255, 255],
//     [255, 0, 255],
//     [0, 255, 255],
//     [255, 255, 0],
//     [0, 0, 0],
// ]

// let i = 0;
// while (true) {
//     writePacket(Array(24).fill(colors[i]));
//     i = (i + 1) % colors.length;
//     await new Promise((resolve) => {
//         setTimeout(() => {
//             resolve();
//         }, 1000);
//     });
// }

const artnet = new dmxnet({});
const receiver = artnet.newReceiver({});

let SKIP_PACKETS = 29;
let skipCounter = SKIP_PACKETS;
receiver.on("data", (data) => {
    if (skipCounter < SKIP_PACKETS) {
        skipCounter++;
        return;
    }
    skipCounter = 0;
    /** @type {[number, number, number][]} */
    const rgbData = [];
    for (let i = 0; i < 24; i++) {
        rgbData.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2]]);
    }
    writePacket(rgbData);
});

/**
 * @param {[number, number, number][]} values
 */
function writePacket(values) {
    let command = "";
    for (let i = 0; i < 24; i++) {
        command += `echo "${i + 1} r ${values[i][0] * 100}" > /proc/led/led_color\n`;
        command += `echo "${i + 1} g ${values[i][1] * 100}" > /proc/led/led_color\n`;
        command += `echo "${i + 1} b ${values[i][2] * 100}" > /proc/led/led_color\n`;
    }
    ssh.stdin.write(command);
}