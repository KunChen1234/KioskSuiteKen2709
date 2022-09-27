//Interface of NFC
import { SerialPort } from "serialport";
import { DelimiterParser } from '@serialport/parser-delimiter'
import { EventEmitter } from "node:events";
import{readTag} from "@roobuck-rnd/nfc_tools";
import {parser} from "@roobuck-rnd/nfc_tools"
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
        const port=ports.filter(port=>{
            return port.vendorId=="09D8"
        })
        const COM=port[0].path
        // console.log(ports)
        // for (const element of ports) {
        //     if (element.vendorId === "09D8") {
        //         console.log("find")
        //         findcom = true
        //         COM = element.path
        //     }
        // }
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
async function EncodeBufferToTag(data: Buffer) {
    if (data.subarray(0, 4).toString() === "0000") {
        console.log("No card")
    }
    else if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
        // asyncRead(data);
        console.log(data)
        console.log(data.toString())
        console.log("Get card infor")
    }
    else {
        console.log("scan failed")
    }
}
async function main() {
    const internalEvents = new EventEmitter
    const { result, path } = await FindCOM()
    if (result) {
        let port = await OpenPort(path)
        let runLoop = true
        // port.on("open", async () => {
        //     internalEvents.on("shutdown", () => {
        //         runLoop = false;
        //     })
        // });
        const dataParser = port.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
        while (runLoop) {
            let data = await command(port, '050010\r', dataParser)
            console.log(data)
            const tagData = await readTag(port,dataParser);
            console.log(tagData);
            dataParser.removeAllListeners();
        }
    }
    else {
        console.log("Connect to scanner please")
    }
   
 

}



// async function asyncRead(data: Buffer) {
//     console.log("Buffer isBuffer: " + Buffer.isBuffer(data))
//     console.log("data: " + data)
//     console.log("data length: " + data.length)
//     console.log("data first four: " + data.subarray(0, 4).toString())
//     if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
//         const converted = Buffer.from(data.toString(), "hex");
//         const start = converted.toString().indexOf("{");
//         const end = converted.toString().lastIndexOf("}");
//         const strCon = converted.subarray(start, end + 1).toString("utf8").replace(/\0/g, "");
//         console.log("converted: " + converted.toString())
//         console.log("start: " + start)
//         console.log("end: " + end)
//         let dataObj: RoobuckTag | null = null;
//         console.log(converted.toString())
//         try{
//             dataObj=JSON.parse()
//         }catch(err)
//         {
//             console.log(err)
//         }
//         // try {

//         //     // return JSON.parse(strCon);
//         // } catch (err) {
//         //     // await command(port, "0407646006E3000400\r", dataParser); // Short high Beep
//         //     // await command(port, "0407646004F401F401\r", dataParser); // long low Beep
//         //     // await command(port, "041207\r", dataParser);
//         //     console.log(err);
//         // }
//     } else {
//         // await command(port, "0407646006E3000400\r", dataParser); // Short high Beep
//         // await command(port, "0407646004F401F401\r", dataParser); // long low Beep
//         // await command(port, "041207\r", dataParser);
//         console.log("Failed to Read Tag data");
//     }
// }

// async function asyncRead(comPort: SerialPort, dataParser: DelimiterParser): Promise<[string, unknown]> {
// 	await command(comPort, "041007\r", dataParser);
// 	await command(comPort, "041101\r", dataParser);
// 	// eslint-disable-next-line no-constant-condition
// 	while (true) {
// 		try {
// 			const { result, tagId } = await scanTag(comPort, dataParser);
// 			if (result && tagId) {
// 				await command(comPort, "041107\r", dataParser);
// 				const data = await command(comPort, "20020420\r", dataParser); // Read data encoded in tag
// 				if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
// 					const converted = Buffer.from(data.toString(), "hex");
// 					const start = converted.toString().indexOf("{");
// 					const end = converted.toString().lastIndexOf("}");
// 					const strCon = converted.subarray(start, end + 1).toString("utf8").replace(/\0/g, "");
// 					try {
// 						return [tagId, JSON.parse(strCon)];
// 					} catch (err) {
// 						await command(comPort, "0407646006E3000400\r", dataParser); // Short high Beep
// 						await command(comPort, "0407646004F401F401\r", dataParser); // long low Beep
// 						await command(comPort, "041207\r", dataParser);
// 						console.error(err);
// 					}
// 				} else {
// 					await command(comPort, "0407646006E3000400\r", dataParser); // Short high Beep
// 					await command(comPort, "0407646004F401F401\r", dataParser); // long low Beep
// 					await command(comPort, "041207\r", dataParser);
// 					console.log("Failed to Read Tag data");
// 				}
// 			}
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}
// }




main()