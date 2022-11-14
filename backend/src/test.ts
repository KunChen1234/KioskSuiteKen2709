// import { readTag } from "@roobuck-rnd/nfc_tools";
// import { FindCOM } from "./scanner";

import { Prisma, PrismaClient } from "@prisma/client";
import { mqtt, connectToMqtt, addSubscribeInMqtt } from "./mqtt";
const prisma = new PrismaClient();
// async function a() {
//     const { result, path } = await FindCOM();
//     readTag()
// }
interface result {
    SN: string | null;
    bssid: string | null;
    chargingStatus: boolean | undefined
}

async function a() {
    const b = await connectToMqtt();
    let a = await mqtt(b, prisma);


    await addSubscribeInMqtt("cr4c7525bc785c", b);
    a = await mqtt(b, prisma);
    console.log("result: " + a.SN + a.bssid + a.chargingStatus);
    console.log("b");
}

a()
