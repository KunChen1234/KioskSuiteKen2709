// import { openComPort, readTag } from "@roobuck-rnd/nfc_tools";
// import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
// import { LampInfo } from "./typeguards/LampInfo";
// import { PrismaClient } from "@prisma/client";
// import SearchingBySN from '../database/User/search';
// import closeDatabase from "../database/closeDatabase";
// import checkLamp from "../database/LoginList/checkLamp";
// import parser from "./parser";
// import { getHeapSpaceStatistics } from "v8";
// async function a() {
//     const prisma = new PrismaClient();
//     const serialport = await openComPort();
//     const path = serialport[0];
//     const dataParser = serialport[1];
//     while (true) {
//         if (dataParser) {
//             var resultOfScanner = await readTag(path, dataParser, false);
//             if (resultOfScanner) {
//                 var result = JSON.parse(parser(resultOfScanner));
//                 if (result.ID) {
//                     var dataFromdatabase = await SearchingBySN(prisma, result.ID);
//                     await closeDatabase(prisma);
//                     //  && CheckID
//                     if (dataFromdatabase) {
//                         var date = new Date()
//                         var newpeople: PeopleInfoTag = {
//                             ID: dataFromdatabase.userID,
//                             section: dataFromdatabase.areaName,
//                             lastName: dataFromdatabase.lastName,
//                             firstName: dataFromdatabase.firstName,
//                             department: dataFromdatabase.Department,
//                             photo: dataFromdatabase.photo,
//                             job: dataFromdatabase.job,
//                             date: Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date),
//                             time: Intl.DateTimeFormat("en-UK", { hour: "2-digit", minute: "2-digit" }).format(date),
//                             isDayShift: undefined
//                         }
//                         if (newpeople.time) {
//                             if (newpeople.time >= "04:00:00" && newpeople.time <= "16:00:00") {
//                                 // console.log("dayshift")
//                                 newpeople.isDayShift = true;
//                             }
//                             else {
//                                 newpeople.isDayShift = false;
//                             }
//                         }
//                         else {
//                             // console.log("Do not have Login time!")
//                         }
//                         dataParser.removeAllListeners();
//                         var getPeopleInfo = true;
//                     }
//                 }
//                 if (result.MAC && result.SN) {
//                     var newLamp: LampInfo = result;
//                     var resultOfCheckLamp = await checkLamp(prisma, result.MAC, result.SN);
//                     if (resultOfCheckLamp) {
//                         var getLampInfo = true;
//                     }
//                     else {
//                         var getLampInfo = false;
//                         var getPeopleInfo = false;
//                     }
//                 }
//             }
//             dataParser.removeAllListeners();
//         }
//         console.log("start:");
//         console.table(getHeapSpaceStatistics());
//         console.log(" finish");
//     }
// }
// a()

import setLogger from "./logger";

function a() {
    const logger = setLogger();
    logger.debug("a");
}
a()