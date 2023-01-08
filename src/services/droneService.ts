import { io } from '../index'
import { getCache } from './cache'
import { Pilot } from './types';

/**
 * Calculate the distance to the No Drone Zone 
*/
export const distanceNDZ = (x: number, y: number): number => {
    const width = Math.abs(250000 - x);
    const height = Math.abs(250000 - y);
    return Math.sqrt(width*width + height*height)
}

/**
 * Broadcast the new information to the frontend 
*/
export const broadcast = async () => {

    const cache = await getCache();

    const droneKeys = await cache.keys('*');

    const pilots: Pilot[] = [] 
    for(const key of droneKeys) {
        const data = await cache.get(key);
        if(data) {
            const pilot = JSON.parse(data) as Pilot;
            pilots.push(pilot);
        }
    }

    io.emit("pilots", JSON.stringify(pilots));
}
