//Interface of NFC

/* Used for scanning data from NFC and get data from database
*/
"use strict";
import { SerialPort } from "serialport";
import { DelimiterParser } from '@serialport/parser-delimiter'
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents";
import SearchingBySN from "../database/search";
import { PrismaClient } from "@prisma/client";
import { Result } from "../database/search"
import { exit, removeAllListeners } from "node:process";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import mqtt from "./mqtt";
import { LampInfo } from "./typeguards/LampInfo";
import { AutoDetectTypes } from "@serialport/bindings-cpp";
import { connect } from "node:http2";



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
        let DayShift: TagBoardInfo[] = [];
        let NightShift: TagBoardInfo[] = [];
        // Server.on("connect", (client) => {
        //     client.on("UpdateDayShift", () => {
        //         console.log("use MQTT");
        //     })

        // })

        setInterval(async () => {
            if (AllShift.length > 0) {
                let newAllShift = AllShift;
                let newDayShift: TagBoardInfo[] = [];
                let newNightShift: TagBoardInfo[] = [];
                if (newAllShift.length > 0) {
                    for (let i = 0; i < AllShift.length; i++) {
                        const SN = newAllShift[0].lamp.SN;
                        if (SN) {
                            const mqttData = await mqtt(SN)
                            newAllShift[i].lamp.Bssid = mqttData.bssid;
                            newAllShift[i].lamp.ChargingStatus = mqttData.chargingStatus;
                            if (AllShift[i].person.isDayShift) {
                                newDayShift.push(newAllShift[i]);
                            }
                            else {
                                newNightShift.push(newAllShift[i]);

                            }
                        }
                    }
                }
                AllShift = newAllShift;
                Server.emit("UpdateDayShift", newDayShift);
                Server.emit("UpdateNightShift", newNightShift);
                console.log("NightShift Bssid:" + newNightShift[0].lamp.Bssid);
            }
        }, 1000);
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
                    // console.log("info:" + info)
                    const obj = JSON.parse(info)
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
                        console.log("people Shift: " + newpeople.isDayShift);
                        console.log("LampSN:" + newLamp.SN);
                        DayShift = [];
                        NightShift = []
                        // if (newLamp.SN) {
                        //     const getMqttData = await mqtt(newLamp.SN);
                        //     newLamp.Bssid=getMqttData.bssid;
                        //     newLamp.ChargingStatus=getMqttData.chargingStatus;
                        // }
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

