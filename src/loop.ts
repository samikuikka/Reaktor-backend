import axios from 'axios';
import convert from 'xml-js'
import { getCache, savePilot } from './services/cache';
import { distanceNDZ, broadcast } from './services/droneService'; 
import { responseSchema, Drone } from './services/types';

const url: string = "https://assignments.reaktor.com/birdnest/drones"


/**
 * Function for retrieving drone information every 2 seconds
*/
export const retrieveDrones = async () => {

    const response = await axios.get(url);
    // XML to JSON
    const result = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4}));
    

    const validated = responseSchema.safeParse(result);
    if(validated.success) {
        const drones: Drone[] = result.report.capture.drone as Drone[]; 
        for(const drone  of drones) {

            // Distance to the loon nest
            const distance = distanceNDZ(drone.positionX._text, drone.positionY._text)

            // If too close to loons, then save the offender to the cache
            if(distance <= 100000) {
                await savePilot(drone.serialNumber._text, distance);
            } else {
                
                const cache = await getCache();

                const hit = await cache.get(drone.serialNumber._text);
                if(hit) {
                    await cache.setEx(drone.serialNumber._text, 600, hit)
                }
                
            }
        }

        
        // Update the information in frontend
        broadcast();
    } else {
        console.log('Data is in unknown format')
    }

    setTimeout(retrieveDrones, 2000)
}
