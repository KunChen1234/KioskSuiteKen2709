"use strict";
import { connect, IClientOptions } from "mqtt";
import nodeConfig from "config";
// import setLogger from "./logger";
import { isStatusMessage } from "./typeguards/isStatusMessage";
import { EventEmitter } from 'node:events';
/**
 * 
 * @param sn string - Serial number of test unit
 * @returns {[chargingFormat,bssid]} Object containing booleans or nulls for test results and an object containing device props
 */
async function mqtt(sn: string): Promise<
    {
        bssid: string | null;
        chargingStatus: boolean
    }> {
    return new Promise((resolve) => {
        // const logger = setLogger("mqtt.js");
        let result: {
            bssid: string | null;
            chargingStatus: boolean
        } = {
            bssid: null,
            chargingStatus: false
        }
        const mqttOptions: IClientOptions = {
            clientId: `roobuck_test_Kiosk`,
            username: nodeConfig.get("mqttUser"),
            password: nodeConfig.get("mqttPass")
        }
        console.log(mqttOptions);
        const mqttBroker = "mqtt://192.168.1.105";
        // console.log(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
        // // logger.debug(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
        const mqttClient = connect(mqttBroker, mqttOptions);
        mqttClient.on("connect", (connack) => {
            // console.log("connected: " + JSON.stringify(connack))
            // logger.debug("Connected");
            // console.log("connected")
            mqttClient.subscribe([
                `${sn}/device/status`,
                `production/testing/${sn}`
            ]);
            mqttClient.publish(`production/testing/${sn}`, sn)
        });

        const endTest = setTimeout(() => {
            // logger.error("Timeout Reached. Test Incomplete")
            console.log("Timeout Reached. Test Incomplete");
            testManage.emit("endTest");
        }, 20 * 1000);
        const testManage = new EventEmitter();
        testManage.on("endTest", () => {
            clearTimeout(endTest);
            testManage.removeAllListeners("endTest");
            mqttClient.end();
            // logger.debug("Closing MQTT Connection");
            // logger.debug(JSON.stringify(results));
            resolve(result);
        });
        let statusReceived = false;
        let fuelOk = false;
        mqttClient.on("message", (topic, payload, packet) => {
            if (topic === `production/testing/${sn}`) {
                // logger.debug(payload.toString());
                // console.log("tpic produnction: " + payload.toString())
            }
            // logger.debug(payload.toString());
            // console.log(payload.toString());
            if (topic.split(/\/(.*)/s)[1] === "device/status") {
                statusReceived = true;
                try {
                    const msg = JSON.parse(payload.toString());
                    if (isStatusMessage(msg)) {
                        if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
                            // Do Something
                            // Confirm Fuel Gauge is operating
                            // console.log("FUEL VALUE START");
                            // console.log(msg.fuelRaw.toString());
                            // console.log("FUEL VALUE END");
                            fuelOk = true
                            result.bssid = msg.bssid;
                            if (msg.charging === 1) {
                                result.chargingStatus = true;
                            } else if (msg.charging === 0) {
                                result.chargingStatus = false;
                            }
                            // console.log("DataFrom" + payload.toString());
                        } else {
                            console.log("FUEL VALUE START");
                            console.log(msg.fuelRaw.toString());
                            console.log("FUEL VALUE END");
                            fuelOk = false
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
                testManage.emit("endTest")
            }
            if (statusReceived) {
                testManage.emit("endTest")
            }
        });
    })
}

// async function a() {
//     const a = await mqtt("cr4c7525bc785c");
//     console.log("bssid:" + a.bssid);
//     console.log("ChargingStatus:" + a.chargingStatus);
// }
// a()
export default mqtt;