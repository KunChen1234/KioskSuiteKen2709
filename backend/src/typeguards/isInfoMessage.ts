interface infoMessage {
    firmwareVersion: string;
    serialNumber: string;
    macAddress: string;
    userId0: string;
    userId1: string;
    userId2: string;
    groupId: string;
    deviceId: string;
    uwbId: string;
    configVersion: string;
    rfid: string;
    bleId: string;
    bleMac: string;
    time: number;
    ipAddress: string;
    productCode?: string;
    batteryCapacity?: string;
    dsrcEnabled?: boolean;
    lteEnabled?: boolean;
    uwbEnabled?: boolean;
    loraEnabled?: boolean;
}

function isInfoMessage(obj: unknown): obj is infoMessage {
    if (typeof obj === "object") {
        const parse = obj as Record<string, unknown>;
        return "firmwareVersion" in parse && typeof parse.firmwareVersion === "string" &&
            "serialNumber" in parse && typeof parse.serialNumber === "string" &&
            "macAddress" in parse && typeof parse.macAddress === "string" &&
            "userId0" in parse && typeof parse.userId0 === "string" &&
            "userId1" in parse && typeof parse.userId1 === "string" &&
            "userId2" in parse && typeof parse.userId2 === "string" &&
            "groupId" in parse && typeof parse.groupId === "string" &&
            "deviceId" in parse && typeof parse.deviceId === "string" &&
            "uwbId" in parse && typeof parse.uwbId === "string" &&
            "configVersion" in parse && typeof parse.configVersion === "string" &&
            "rfid" in parse && typeof parse.rfid === "string" &&
            "bleId" in parse && typeof parse.bleId === "string" &&
            "bleMac" in parse && typeof parse.bleMac === "string" &&
            "time" in parse && typeof parse.time === "number" &&
            "ipAddress" in parse && typeof parse.ipAddress === "string"
    } else {
        return false;
    }
}

export { isInfoMessage, infoMessage }