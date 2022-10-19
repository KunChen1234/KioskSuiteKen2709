interface DsrcStatus {
    mac: string;
}

function isDsrcStatus(obj: unknown): obj is DsrcStatus {
    if (typeof obj === "object") {
        const parse = obj as Record<string, any>;
        return "mac" in parse && typeof parse.mac === "string";
    }
    return false;
}

export { DsrcStatus, isDsrcStatus };