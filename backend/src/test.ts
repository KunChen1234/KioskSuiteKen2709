import setLogger from "./logger";

function a() {
    const logger = setLogger();
    logger.debug("a");
}
a()