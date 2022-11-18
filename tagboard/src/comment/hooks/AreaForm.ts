interface AreaInfoForConfiguration {
    areaName: string;
    areaColor: string;
}
interface AreaInfoForShift {
    areaName?: string | null | undefined;
    areaColor?: string | null | undefined;
}
export  type {AreaInfoForShift,AreaInfoForConfiguration};