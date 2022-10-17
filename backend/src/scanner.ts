//Interface of NFC

/* Used for scanning data from NFC and get data from database
*/
import { SerialPort } from "serialport";
import { DelimiterParser } from '@serialport/parser-delimiter'
import { readTag } from "@roobuck-rnd/nfc_tools";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents";
import SearchingBySN from "../database/search";
import { PrismaClient } from "@prisma/client";
import { Result } from "../database/search"
import { exit } from "node:process";
import { Sign } from "node:crypto";
interface RoobuckTag {
    MAC: string;
    SN: string;
}
interface SignIn {
    SN: string | null,
    section: string | null,
    name: string | null,
    photo: string | null | undefined,
    job: string | null,
    date: string,
    time: string
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
// Server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
async function Scanmain(Server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {

    let dayshift: SignIn[] = [];
    let nightshift: SignIn[] = [];
    const { result, path } = await FindCOM();
    if (result) {
        let port = await OpenPort(path);
        let runLoop = true;
        let times = 0; // times%2==0 ID info, times%2==1 lamp info 
        // Server.on("connect", (client) => {
        //     client.on("disconnect", () => {
        //         console.log("disconncet")
        //         port.close();
        //     })
        // })
        // client.emit("aa",port)
        const dataParser = port.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
        while (runLoop) {
            // Server.on("connect", (client) => {
            //     client.once("getDayShift", () => {
            //         if (dayshift) {
            //             Server.emit("DayShift", dayshift);
            //         }
            //     })
            //     client.on("getNightShift", () => {
            //         if (nightshift) {
            //             Server.emit("NightShift", dayshift);
            //         }
            //     })
            // })
            const data = await command(port, '050010\r', dataParser);
            // const data1 = await command(port, "20020420\r", dataParser); 
            // console.log("data1: "+data1.toString());
            // const converted = Buffer.from(data1.toString(), "hex");
            // console.log("conveted: "+converted.toString())
            if (data.toString() === "0000") {
                // console.log("no card");
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
                    if (times % 2 == 0) {
                        const dataFromdatabase: Result | null = await SearchingBySN(obj.SN)
                        // console.log("photo: " + dataFromdatabase?.photo)
                        try {
                            await prisma.$disconnect();
                            console.log("data closed")
                        }
                        catch (e) {
                            console.error(e)
                            await prisma.$disconnect()
                            process.exit(1)
                        }
                        if (dataFromdatabase) {
                            // SN: string,
                            // section:string,
                            // name:string,
                            // photo:string,
                            // job:string,
                            // time:Date
                            const date = new Date()
                            const newpeople = {
                                SN: dataFromdatabase.serialnumber,
                                section: dataFromdatabase.section,
                                name: dataFromdatabase.name,
                                photo: dataFromdatabase.photo,
                                job: dataFromdatabase.job,
                                date: Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date),
                                time: Intl.DateTimeFormat("en-UK", { hour: "2-digit", minute: "2-digit" }).format(date),
                            }
                            if (newpeople.time >= "04:00:00" && newpeople.time <= "16:00:00") {
                                dayshift.push(newpeople);
                            }
                            else {
                                nightshift.push(newpeople);
                            }
                            times++;
                            if (times > 1) {
                                times = 0;
                            }
                        }
                        else {
                            console.log("no match info");
                        }
                    } else {
                        console.log("start to send data");
                        Server.emit("DayShift", dayshift);
                        Server.emit("NightShift", nightshift);
                        Server.emit("LampInfo", obj);
                        times++;
                        if (times > 1) {
                            times = 0;
                        }
                    }
                    Server.emit("MAC", obj.MAC)
                    Server.emit("SN", obj.SN)
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
        console.log("Connect to scanner please");
        exit(1);
    }

}

//SN: C0409W-4C7525BC7020
// Scanmain()
export default Scanmain
export { RoobuckTag, SignIn }
