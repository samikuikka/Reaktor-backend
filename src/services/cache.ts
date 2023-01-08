import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import axios from 'axios';
import { Pilot } from './types';

let redisClient: RedisClientType
let isReady: boolean; 

// Get the cache
async function getCache(): Promise<RedisClientType> {
    if (!isReady) {
        redisClient = createClient();

        redisClient.on("error", (error) => console.error(`redis error :', ${error}`));
        redisClient.on('connect', () => console.log('redis connected'));
        redisClient.on('ready', () => {
            isReady = true;
            console.log('redis ready')
        })

        await redisClient.connect();
    }
    return redisClient;
}

// Save the pilot (offender) to the cache
async function savePilot(serialNumber: string, distance: number) {
    try {

        // Cache hit
        const hit = await redisClient.get(serialNumber);

        // If cache hit then serve the data from cache, if not then query the API
        if (hit) {
            const hitData = JSON.parse(hit);

            const pilot: Pilot = {
                ...hitData,
                distance: Math.min(distance, hitData.distance)
            }
            
            redisClient.setEx(serialNumber, 600, JSON.stringify(pilot));
        } else {
            const pilotResponse = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
            const pilotData = pilotResponse.data;

            const pilot: Pilot = {
                name: pilotData.firstName.concat(" ", pilotData.lastName),
                phoneNumber: pilotData.phoneNumber,
                email: pilotData.email,
                distance
            };

            redisClient.setEx(serialNumber, 600, JSON.stringify(pilot));
        }
    } catch (err) {
        console.error('Error retrieving pilot information')
    }
}


getCache().then(client => {
    redisClient = client
}).catch(err => {
    console.error('Failed to connect to redis')
})

export {
    getCache,
    savePilot
}