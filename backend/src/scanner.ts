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
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import mqtt from "./mqtt";
import { LampInfo } from "./typeguards/LampInfo";



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
// client: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
// Server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
async function Scanmain(Server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    let AllShift: TagBoardInfo[] = [];
    const { result, path } = await FindCOM();
    if (result) {
        let port = await OpenPort(path);
        let runLoop = true;
        // Server.on("connect", (client) => {
        //     client.on("disconnect", () => {
        //         console.log("disconncet")
        //         port.close();
        //     })
        // })
        // client.emit("aa",port)
        const dataParser = port.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
        //start NFC scaning

        let getPeopleInfo = false;
        let getLampInfo = false;
        let newpeople: PeopleInfoTag = {
            ID: undefined,
            section: undefined,
            name: undefined,
            photo: undefined,
            job: undefined,
            date: undefined,
            time: undefined,
            isDayShift: undefined
        };
        let newLamp: LampInfo = {
            MAC: undefined,
            SN: undefined,
            Bssid: undefined,
            ChargingStatus: undefined
        };
        while (runLoop) {


            const data = await command(port, '050010\r', dataParser);
            // const data1 = await command(port, "20020420\r", dataParser); 
            // console.log("data: "+data.toString());
            // console.log("data1: "+data1.toString());
            // const converted = Buffer.from(data1.toString(), "hex");
            // console.log("conveted: "+converted.toString())
            if (data.toString() === "0000") {
                // console.log("no card");
            }
            else if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
                const tagData = await readTag(port, dataParser);
                // console.log("tagData: "+tagData?.toString());
                // client.emit("tagID",data.toString());
                console.log("tagData: " + tagData);
                if (tagData) {
                    const start = tagData.indexOf("\{")
                    const end = tagData.indexOf("\}")
                    const info = tagData.substring(start, end + 1)
                    console.log("info:" + info)
                    const obj = JSON.parse(info)
                    // console.log("type:" + typeof obj)
                    // console.log("MAC: " + obj.MAC);
                    // console.log("SN: " + obj.SN);
                    if (obj.MAC && obj.SN) {
                        newLamp = {
                            MAC: undefined,
                            SN: undefined,
                            Bssid: undefined,
                            ChargingStatus: undefined
                        };
                        console.log("Lamp");
                        newLamp = obj;
                        Server.emit("LampInfo", obj);
                        getLampInfo = true;
                        console.log("newLamp MAC:" + newLamp.MAC);
                        console.log("newLamp SN: " + newLamp.SN);
                    }
                    else if (obj.ID) {
                        console.log("People");
                        newpeople = {
                            ID: undefined,
                            section: undefined,
                            name: undefined,
                            photo: undefined,
                            job: undefined,
                            date: undefined,
                            time: undefined,
                            isDayShift: undefined
                        };
                        const prisma = new PrismaClient();
                        const dataFromdatabase: Result | null = await SearchingBySN(obj.ID);
                        Server.emit("PeopleID", obj.ID);
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
                            const date = new Date()
                            newpeople = {
                                ID: dataFromdatabase.serialnumber,
                                section: dataFromdatabase.section,
                                name: dataFromdatabase.name,
                                photo: dataFromdatabase.photo,
                                job: dataFromdatabase.job,
                                date: Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date),
                                time: Intl.DateTimeFormat("en-UK", { hour: "2-digit", minute: "2-digit" }).format(date),
                                isDayShift: undefined
                            }
                            if (newpeople.time) {
                                if (newpeople.time >= "04:00:00" && newpeople.time <= "16:00:00") {
                                    newpeople.isDayShift = true;
                                }
                                else {
                                    newpeople.isDayShift = false;
                                }
                            }
                            getPeopleInfo = true;
                        }
                        else {
                            console.log("no match info");
                        }
                    }
                    else {
                        console.log("Unrecognized");
                    }
                    if (getLampInfo && getPeopleInfo) {
                        console.log("start to send data");
                        let DayShift: TagBoardInfo[] = [];
                        let NightShift: TagBoardInfo[] = [];
                        console.log("people Shift: " + newpeople.isDayShift);
                        console.log("LampSN:" + newLamp.SN);
                        AllShift.push({ person: newpeople, lamp: newLamp });
                        AllShift.forEach(element => {
                            if (element.person.isDayShift) {
                                DayShift.push(element);
                            } else {
                                NightShift.push(element);
                            }
                        });
                        Server.emit("NightShift", NightShift);
                        Server.emit("DayShift", DayShift);
                        getLampInfo = false;
                        getPeopleInfo = false;
                        // Server.emit("ReadyForNext", true);
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
        console.log("Connect to scanner please");
        exit(1);
    }

}

//SN: C0409W-4C7525BC7020
// Scanmain()
export default Scanmain
