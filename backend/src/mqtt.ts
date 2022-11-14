"use strict";
import { connect, IClientOptions, MqttClient } from "mqtt";
import nodeConfig from "config";
// import setLogger from "./logger";
import { isStatusMessage } from "./typeguards/isStatusMessage";
import { prisma, PrismaClient } from "@prisma/client";
import EventEmitter from "node:events";
import Logout from "../database/LoginList/Logout";
import closeDatabase from "../database/closeDatabase";
/**
 * 
 * @param sn string - Serial number of test unit
 * @returns {[chargingFormat,bssid]} Object containing booleans or nulls for test results and an object containing device props
 */
//  sn: string
async function connectToMqtt(): Promise<MqttClient> {
    const mqttOptions: IClientOptions = {
        clientId: `roobuck_test_Kiosk`,
        username: nodeConfig.get("mqttUser"),
        password: nodeConfig.get("mqttPass")
    }
    // console.log(mqttOptions);
    const mqttBroker = "mqtt://192.168.1.105";
    // console.log(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
    // // logger.debug(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
    const mqttClient = connect(mqttBroker, mqttOptions);
    return new Promise((resolve) => {
        resolve(mqttClient);
    })
}

async function addSubscribeInMqtt(sn: string, mqttClient: MqttClient) {
    mqttClient.on("connect", () => {
        // console.log("connected: " + JSON.stringify(connack))
        // logger.debug("Connected");
        // console.log("connected")
        mqttClient.subscribe([
            `${sn}/device/status`,
        ]);
    });
    console.log("add mqtt sub")
}
interface resultOfMqtt {
    SN: string | null;
    bssid: string | null;
    chargingStatus: boolean | undefined
}
async function mqtt(mqttClient: MqttClient, prisma: PrismaClient): Promise<resultOfMqtt> {
    console.log("into mqtt")
    // const logger = setLogger("mqtt.js");
    return new Promise((resolve) => {
        let result: resultOfMqtt = {
            SN: null,
            bssid: null,
            chargingStatus: undefined
        }
        mqttClient.on("message", async (topic, payload) => {
            // logger.debug(payload.toString());
            console.log("topic: " + topic);
            console.log(payload.toString());
            // console.log(topic.split(/\/(.*)/s)[1]);
            if (topic.split(/\/(.*)/s)[1] === "device/status") {
                try {
                    const msg = JSON.parse(payload.toString());
                    if (isStatusMessage(msg)) {
                        if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
                            // Do Something
                            // Confirm Fuel Gauge is operating
                            // console.log("FUEL VALUE START");
                            // console.log(msg.fuelRaw.toString());
                            // console.log("FUEL VALUE END");
                            result.SN = topic;
                            result.bssid = msg.bssid;
                            console.log("resovle");
                            console.log(result);
                            if (msg.charging === 1) {
                                result.chargingStatus = true;
                                // await Logout(prisma, result.SN);
                                // closeDatabase(prisma);
                            } else if (msg.charging === 0) {
                                result.chargingStatus = false;
                            }
                            resolve(result);
                            // console.log("DataFrom" + payload.toString());
                        } else {
                            // console.log("FUEL VALUE START");
                            // console.log(msg.fuelRaw.toString());
                            // console.log("FUEL VALUE END");
                            // fuelOk = false;
                        }
                    } else {
                        console.log("failed");
                        // Fail Condition
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        console.log("Error:" + err);
                    }
                }
                // testManage.emit("endTest")
            }
        });
    })
}
export { mqtt, connectToMqtt, addSubscribeInMqtt };