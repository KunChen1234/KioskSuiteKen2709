
"use strict";
/*
MAC: MAC address,
SN: serial number,
Bssid: bssid from mqtt,
ChargingStatus: the lamp start charging or not.
*/
interface LampInfo {
    MAC: string | undefined | null;
    SN: string | undefined | null;
    Bssid: string | undefined | null;
    ChargingStatus: boolean | undefined | null;
    updateTime: string | undefined;
}
export { LampInfo }