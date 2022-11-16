import { PrismaClient } from '@prisma/client'
import LocationInfo from '../../src/typeguards/LocationInfo';


async function UpdateLocation(newDepartment: LocationInfo, prisma: PrismaClient): Promise<LocationInfo[]> {
    if (newDepartment.BSSID) {
        await prisma.location.update({
            where: {
                BSSID: newDepartment.BSSID,
            },
            data: { locationName: newDepartment.locationName }
        })
    }
    const allLocation: LocationInfo[] = await prisma.location.findMany({
        orderBy: {
            locationName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allLocation);
    })

}

export default UpdateLocation;