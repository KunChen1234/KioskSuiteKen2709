import SearchingBySN from "../database/User/search";
import resultOfUserFromDatabase from "./typeguards/resultOfUserFromDatabase";
async function a() {
    const b: resultOfUserFromDatabase | null = await SearchingBySN("0000001");
    console.log(b);
    if (b) {
        console.log(b.Area?.areaName);
    }

}
a();
