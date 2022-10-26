//Interface of NFC

/* Used for scanning data from NFC and get data from database
*/
"use strict";
import { SerialPort } from "serialport";
import { DelimiterParser } from '@serialport/parser-delimiter'
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents";
import { exit } from "node:process";
import { AutoDetectTypes } from "@serialport/bindings-cpp";





async function readTag(comPort: SerialPort<AutoDetectTypes>, dataParser: DelimiterParser) {
    const beep = true;
    await command(comPort, "041007\r", dataParser);
    await command(comPort, "041101\r", dataParser);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            // console.log("Scanning")
            await command(comPort, "041107\r", dataParser);
            const data = await command(comPort, "20020420\r", dataParser); // Read data encoded in tag
            if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
                // console.log(data.toString());
                const converted = Buffer.from(data.toString(), "hex");
                // console.log(converted.toString());
                const start = converted.indexOf(0x03);
                const end = converted.indexOf(0xFE);
                // console.log(start, end);
                let strCon;
                if (start >= 0 && end > start) {
                    strCon = converted.subarray(start, end).toString("utf8").replace(/\0/g, "");
                }
                else {
                    strCon = converted.toString("utf8").replace(/\0/g, "");
                }
                if (beep) {
                    // success Beeps
                    await command(comPort, "0407646005E3000400\r", dataParser); // Short low Beep
                    await command(comPort, "0407646007F401F401\r", dataParser); // long high Beep
                    await command(comPort, "041207\r", dataParser);
                }
                // console.log(strCon)
                return strCon;
            }
            else {
                if (beep) {
                    await command(comPort, "0407646006E3000400\r", dataParser); // Short high Beep
                    await command(comPort, "0407646004F401F401\r", dataParser); // long low Beep
                    await command(comPort, "041207\r", dataParser);
                }
                console.log("Failed to Read Tag data");
                return null;
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}
async function FindCOM(): Promise<{ result: boolean, path: string }> {

    return new Promise(async (resolve) => {
        let ports = await SerialPort.list();
        const port = ports.filter(port => {
            return port.vendorId == "09D8"
        })
        if (port.length > 0) {
            // console.log("find")
            const COM = port[0].path
            resolve({ result: true, path: COM })
        }
        else {
            // console.log("not find")
            resolve({ result: false, path: "null" })
        }
    });
}

async function OpenPort(): Promise<SerialPort | undefined> {
    const { result, path } = await FindCOM();
    if (result) {
        const port = new SerialPort({ path: path, baudRate: 9600, autoOpen: true }, (err: Error | null | undefined) => {
            if (err) {
                console.error(err.message);
                console.log("Unable to open serial port, exiting");
                process.exit(1);
            }
        });
        return new Promise((resolve) => {
            resolve(port)
        })
    }
}
async function command(port: SerialPort, command: String, dataParser: DelimiterParser): Promise<Buffer> {
    port.write(command)
    return new Promise((resolve) => {
        dataParser.once("data", (data: Buffer) => {
            // console.log(data.toString())
            resolve(data)
        })
    })
}


async function Scanmain(Server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, port: SerialPort, dataParser: DelimiterParser):
    Promise<string | undefined> {
    const { result, path } = await FindCOM();
    if (result) {
        //start NFC scaning
        const data = await command(port, '050010\r', dataParser);
        if (data.toString() === "0000") {
            // console.log("no card");
        }
        else if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
            const tagData = await readTag(port, dataParser);
            console.log("tagData: " + tagData);
            if (tagData) {
                const start = tagData.indexOf("\{")
                const end = tagData.indexOf("\}")
                const info = tagData.substring(start, end + 1)
                return new Promise((resolve) => {
                    dataParser.removeAllListeners();
                    resolve(info)
                })
            }
        }
        else {
            console.log("scan failed");
            console.log("data: " + data + "isBuffer: " + Buffer.isBuffer(data) + "data.subarray: " + data.subarray(0, 4).toString() + "length: " + data.length);
        }
        dataParser.removeAllListeners();
    }
    else {
        console.log("Connect to scanner please");
        exit(1);
    }

}
export { Scanmain, OpenPort }

