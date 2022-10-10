//Interface of NFC

/* Used for scanning data from NFC and get data from database
*/
import { SerialPort } from "serialport";
import { DelimiterParser } from '@serialport/parser-delimiter'
import { EventEmitter } from "node:events";
import { readTag } from "@roobuck-rnd/nfc_tools";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents";
import SearchingBySN from "../database/search";
import { PrismaClient } from "@prisma/client";
import { Result } from "../database/search"
import { Client } from "socket.io/dist/client";
import { isObject } from "node:util";
interface RoobuckTag {
    MAC: string;
    SN: string;
}

function isRoobuckTag(obj: unknown): obj is RoobuckTag {
    if (obj && typeof obj === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parse = obj as Record<string, any>;
        return parse && typeof parse === "object" && !Array.isArray(parse) &&
            parse.MAC && typeof parse.MAC === "string" && parse.SN &&
            typeof parse.SN === "string";
    } else {
        return false;
    }
}
async function FindCOM(): Promise<{ result: boolean, path: string }> {

    return new Promise(async (resolve) => {
        let ports = await SerialPort.list();
        const port = ports.filter(port => {
            return port.vendorId == "09D8"
        })
        const COM = port[0].path

        if (port) {
            resolve({ result: true, path: COM })
        }
        else {
            resolve({ result: false, path: "null" })
        }
    });
}

async function OpenPort(COMpath: string): Promise<any | SerialPort | null> {
    console.log(COMpath)
    const port = new SerialPort({ path: COMpath, baudRate: 9600, autoOpen: true }, (err: Error | null | undefined) => {
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
async function command(port: SerialPort, command: String, dataParser: DelimiterParser): Promise<Buffer> {
    port.write(command)
    return new Promise((resolve) => {
        dataParser.once("data", (data: Buffer) => {
            // console.log(data.toString())
            resolve(data)
        })
    })
}
async function CheckdataSuccess(data: Buffer) {
    if (data.subarray(0, 4).toString() === "0000") {
        console.log("No card");
    }
    else if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
        // asyncRead(data);
        console.log(data);
        console.log(data.toString());
        console.log("Get card infor");
    }
    else {

    }
}
// client: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

async function Scanmain(Server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {

    let personalInfo: Result[] = [];
    const { result, path } = await FindCOM();
    if (result) {
        let port = await OpenPort(path);
        let runLoop = true
        Server.on("connect", (client) => {
            client.on("disconnect", () => {
                console.log("disconncet")
                port.close();
            })
        })
        // client.emit("aa",port)
        const dataParser = port.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
        while (runLoop) {
            const data = await command(port, '050010\r', dataParser);
            // const data1 = await command(port, "20020420\r", dataParser); 
            // console.log("data1: "+data1.toString());
            // const converted = Buffer.from(data1.toString(), "hex");
            // console.log("conveted: "+converted.toString())
            if (data.toString() === "0000") {
                console.log("no card");
            }
            else if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
                const tagData = await readTag(port, dataParser);

                // client.emit("tagID",data.toString());
                console.log("tagData: " + tagData);
                // const tagID = data.subarray(4, data.length).toString(); not used
                if (tagData) {
                    const start = tagData.indexOf("\{")
                    const end = tagData.indexOf("\}")
                    const info = tagData.substring(start, end + 1)
                    console.log("info:" + info)
                    const obj = JSON.parse(info)
                    console.log("type:" + typeof obj)
                    console.log("MAC: " + obj.MAC);
                    console.log("SN: " + obj.SN);
                    const prisma = new PrismaClient()
                    const dataFromdatabase: Result | null = await SearchingBySN()

                    try {
                        await prisma.$disconnect();
                        console.log("data closed")
                    }
                    catch (e) {
                        console.error(e)
                        await prisma.$disconnect()
                        process.exit(1)
                    }
                    Server.emit("MAC", obj.MAC)
                    Server.emit("SN", obj.SN)
                    if (dataFromdatabase) {
                        personalInfo.push(dataFromdatabase);
                        Server.emit("PersonalInfo", personalInfo);
                    }
                    else {
                        console.log("no match info")
                    }
                }
            }
            else {
                console.log("scan failed");
                console.log("data: " + data + "isBuffer: " + Buffer.isBuffer(data) + "data.subarray: " + data.subarray(0, 4).toString() + "length: " + data.length);
            }
            dataParser.removeAllListeners();
        }
    }
    else {
        console.log("Connect to scanner please")
    }

}

//SN: C0409W-4C7525BC7020
// Scanmain()
export default Scanmain
