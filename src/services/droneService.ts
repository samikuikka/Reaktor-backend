

/**
 * Calculate the distance to the No Drone Zone 
*/
export const distanceNDZ = (x: number, y: number): number => {
    const width = Math.abs(250000 - x);
    const height = Math.abs(250000 - y);
    return Math.sqrt(width*width + height*height)
}

