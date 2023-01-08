import { z } from 'zod';

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
});

type Pilot = {
    name: string,
    phoneNumber: string,
    email: string,
    distance: number
}

export {
    responseSchema,
    Drone,
    Pilot
}