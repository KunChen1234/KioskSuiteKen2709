// // import { readTag } from "@roobuck-rnd/nfc_tools";
// // import { FindCOM } from "./scanner";

// import { Prisma, PrismaClient } from "@prisma/client";
// import { mqtt, connectToMqtt, addSubscribeInMqtt } from "./mqtt";
// const prisma = new PrismaClient();
// // async function a() {
// //     const { result, path } = await FindCOM();
// //     readTag()
// // }
// interface result {
//     SN: string | null;
//     bssid: string | null;
//     chargingStatus: boolean | undefined
// }

// async function a() {
//     const b = await connectToMqtt();
//     b.on("message", async (topic, payload) => {
//         // logger.debug(payload.toString());
//         console.log("topic: " + topic);
//         console.log(payload.toString());
//         // console.log(topic.split(/\/(.*)/s)[1]);
//         // if (topic.split(/\/(.*)/s)[1] === "device/status") {
//         // 	// testManage.emit("endTest")
//         // }
//     });
//     while(true)
//     {
//         console.log("a");
//     }

// }

// a()

import { openComPort, readTag } from "@roobuck-rnd/nfc_tools";
import { scanTag } from "@roobuck-rnd/nfc_tools";
import { ReadlineParser, SerialPort } from "serialport";
async function a() {
    const a = await openComPort();
    const port: SerialPort = a[0];
    if (a[1]) {
        const dataParser: ReadlineParser = a[1];
        const b = await readTag(port, dataParser);
        console.log(b);
    }
}
a()