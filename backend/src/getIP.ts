import { networkInterfaces } from "os";
import nodeConfig from "config";
function getIp(): string {
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object
    // Loop over interfaces to select the current IPv4 Network.
    for (const name of Object.keys(nets)) {
        const netobj = Object.create(nets); // Keeps typescript happy, must be run here inside the loop
        for (const net of netobj[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === "IPv4" && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    let nwInterface: string;
    console.log(nodeConfig.get("nwInterface"));
    if (nodeConfig.get("nwInterface") && typeof nodeConfig.get("nwInterface") === "string") {
        nwInterface = nodeConfig.get("nwInterface");
    } else {
        nwInterface = "eth0";
    }
    let ipAddress: string;
    if (results[nwInterface]) {
        ipAddress = results[nwInterface][0];
    } else {
        // logger.error(`Network Interface ${nwInterface} not found.`);
        ipAddress = "0.0.0.0";
    }
    // logger.debug(`This machine is: ${ipAddress}`);
    return ipAddress;
}

export default getIp();
// const a = getIp();
// console.log(a);