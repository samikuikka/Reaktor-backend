import axios from 'axios';
import convert from 'xml-js'
import { getCache, savePilot } from './services/cache';
import { distanceNDZ } from './services/droneService'; 
import { z } from 'zod';

const url: string = "https://assignments.reaktor.com/birdnest/drones"


// Drone schema 
const droneSchema = z.object({
    serialNumber: z.object({ _text: z.string() }),
    positionY: z.object({ _text: z.preprocess((val) => Number(val), z.number()) }),
    positionX: z.object({ _text: z.preprocess((val) => Number(val), z.number()) })
})

type Drone = z.infer<typeof droneSchema>

// Response schema
const responseSchema = z.object({
    report: z.object({
        deviceInformation: z.any(),
        capture: z.object({ drone: z.array(droneSchema)})
    })
})


/**
 * Function for retrieving drone information every 2 seconds
*/
export const retrieveDrones = async () => {

    const cache = await getCache();

    const response = await axios.get(url);
    // XML to JSON
    const result = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4}));

    let minDistance = Infinity;

    const validated = responseSchema.safeParse(result);
    if(validated.success) {
        for(const drone of result.report.capture.drone) {
            // Distance to the loon nest
            const distance = distanceNDZ(drone.positionX._text, drone.positionY._text)

            // If too close to loons, then save the offender to the cache
            if(distance <= 100000) {

                await savePilot(drone.serialNumber._text);
            }

            // To save the closest distance
            if(distance < minDistance) {
                minDistance = distance;
            }
        }

        // Save the closest
        cache.set('closest', `${minDistance}`);
    } else {
        console.log('Data is in unknown format')
    }

    /* const keys = await cache.keys("*");
    console.log(keys.length); */

    setTimeout(retrieveDrones, 5000)
}
