import type { RedisClientType } from 'redis'
import { createClient } from 'redis'
import axios from 'axios';

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
async function savePilot(serialNumber: string) {
    const pilotResponse = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
    const pilotData = pilotResponse.data;
    const pilot = {
        name: pilotData.firstName.concat(" ", pilotData.lastName),
        phoneNumber: pilotData.phoneNumber,
        email: pilotData.email
    };

    redisClient.setEx(`DRONE:${serialNumber}`, 600, JSON.stringify(pilot));
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