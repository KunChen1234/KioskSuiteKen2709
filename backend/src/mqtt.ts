import { connect, IClientOptions } from "mqtt";
import nodeConfig from "config";
import setLogger from "./logger";
import { isStatusMessage } from "./typeguards/isStatusMessage";
import { EventEmitter } from 'node:events';
import { isInfoMessage } from "./typeguards/isInfoMessage";
import { isDsrcStatus } from './typeguards/isDsrcStatus';
import { sleep } from "@roobuck-rnd/nfc_tools";

/**
 * 
 * @param sn string - Serial number of test unit
 * @returns {[{wifiOk, fuelOk, infoOk, dsrcI2cOk, uwbOk}, {dsrc, uwb}]} Object containing booleans or nulls for test results and an object containing device props
 */
async function mqtt(sn: string): Promise<[{
    wifiOk: boolean
    fuelOk: null | boolean,
    infoOk: null | boolean,
    dsrcMac: null | string,
    uwbOk: null | boolean
}, {
    dsrc: boolean,
    uwb: boolean
}]> {
    return new Promise((resolve) => {
        const logger = setLogger("mqtt.js");
        const mqttOptions: IClientOptions = {
            clientId: `roobuck_test_suite`,
            username: nodeConfig.get("mqttUser"),
            password: nodeConfig.get("mqttPass")
        }

        const mqttBroker: string = nodeConfig.get("mqttBroker");
        logger.debug(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
        const mqttClient = connect(mqttBroker, mqttOptions);
        mqttClient.on("connect", (connack) => {
            // logger.debug("Connected");
            mqttClient.subscribe([
                `${sn}/device/info`,
                `${sn}/device/status`,
                `${sn}/dsrc/status`,
                `${sn}/uwb/scan`,
                `production/testing/${sn}`
            ]);
            mqttClient.publish(`production/testing/${sn}`, sn)
        });
        const results: {
            wifiOk: boolean
            fuelOk: null | boolean,
            infoOk: null | boolean,
            dsrcMac: null | string,
            uwbOk: null | boolean
        } = {
            wifiOk: false,
            fuelOk: null,
            infoOk: null,
            dsrcMac: null,
            uwbOk: null
        }
        const tagProps = {
            dsrc: false,
            uwb: false,
        }
        const endTest = setTimeout(() => {
            logger.error("Timeout Reached. Test Incomplete")
            testManage.emit("endTest");
        }, 20 * 1000);
        const testManage = new EventEmitter();
        testManage.on("endTest", () => {
            clearTimeout(endTest);
            testManage.removeAllListeners("endTest");
            mqttClient.end();
            logger.debug("Closing MQTT Connection");
            logger.debug(JSON.stringify(results));
            resolve([results, tagProps]);
        });
        let [infoReceived, statusReceived, dsrcReceived, uwbReceived] = [false, false, false, false]
        mqttClient.on("message", (topic, payload, packet) => {
            if (topic === `production/testing/${sn}`) {
                logger.debug(payload.toString());
            }
            // logger.debug(payload.toString());
            switch (topic.split(/\/(.*)/s)[1]) {
                //regex to split on first "/", switching on the 2nd element (element 1 should be SN)
                case "device/info": {
                    infoReceived = true;
                    // Do Something
                    // Confirm Serial Number, MAC Address, BLE MAC, etc are all correct
                    try {
                        const msg = JSON.parse(payload.toString());
                        if (isInfoMessage(msg)) {
                            // logger.debug(payload.toString());
                            // Do Something
                            // Confirm Serial Number, MAC Address, BLE MAC, etc are all correct?
                            results.wifiOk = true;
                            if ("dsrcEnabled" in msg && msg.dsrcEnabled !== undefined) {
                                tagProps.dsrc = msg.dsrcEnabled;
                            }
                            if ("uwbEnabled" in msg && msg.uwbEnabled !== undefined) {
                                tagProps.uwb = msg.uwbEnabled;
                            }
                        } else {
                            // Fail  Condition
                            logger.debug(payload.toString());
                        }
                    } catch (err) {
                        if (err instanceof Error) {
                            logger.error(err.message);
                            logger.debug(payload.toString());
                            logger.error("Malformed device/info message received");
                        }
                    }
                    if (
                        infoReceived && statusReceived &&
                        (!tagProps.uwb || (tagProps.uwb && uwbReceived)) &&
                        (!tagProps.dsrc || (tagProps.dsrc && dsrcReceived))
                    ) {
                        testManage.emit("endTest")
                    }
                    break;
                }
                case "device/status": {
                    statusReceived = true;
                    // Do Something
                    try {
                        const msg = JSON.parse(payload.toString());
                        if (isStatusMessage(msg)) {
                            if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
                                // Do Something
                                // Confirm Fuel Gauge is operating
                                logger.debug("FUEL VALUE START");
                                logger.debug(msg.fuelRaw.toString());
                                logger.debug("FUEL VALUE END");
                                results.fuelOk = true
                            } else {
                                logger.debug("FUEL VALUE START");
                                logger.debug(msg.fuelRaw.toString());
                                logger.debug("FUEL VALUE END");
                                results.fuelOk = false
                            }
                        } else {
                            logger.debug(payload.toString());
                            logger.error("Malformed device/status message received")
                            // Fail Condition
                        }
                    } catch (err) {
                        if (err instanceof Error) {
                            logger.error(err.message);
                            logger.debug(payload.toString());
                            logger.error("Malformed device/status message received")
                        }
                    }
                    if (
                        infoReceived && statusReceived &&
                        (!tagProps.uwb || (tagProps.uwb && uwbReceived)) &&
                        (!tagProps.dsrc || (tagProps.dsrc && dsrcReceived))
                    ) {
                        testManage.emit("endTest")
                    }
                    break;
                }
                case "dsrc/status": {
                    dsrcReceived = true;
                    logger.debug("DSRC MQTT RECIEVED");
                    // Do Something
                    // Topic name may change
                    try {
                        const msg = JSON.parse(payload.toString());
                        logger.debug(payload.toString());
                        if (isDsrcStatus(msg)) {
                            results.dsrcMac = msg.mac;
                        } else {
                            logger.error("Malformed dsrc/status message received")
                        }
                    } catch (err) {
                        logger.debug(payload.toString());
                        logger.error("Malformed dsrc/status message received")
                    }
                    if (
                        infoReceived && statusReceived &&
                        (!tagProps.uwb || (tagProps.uwb && uwbReceived)) &&
                        (!tagProps.dsrc || (tagProps.dsrc && dsrcReceived))
                    ) {
                        testManage.emit("endTest")
                    }
                    break;
                }
                default: {
                    logger.debug("Message received but not used for test")
                    break;
                }
            }
        });
    })
}

export default mqtt;