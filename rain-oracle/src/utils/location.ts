export type SingaporeRegion = "north" | "south" | "east" | "west" | "central";
/**
 * Determines the Singapore region based on latitude and longitude.
 * Singapore regions are roughly divided as:
 * - North: lat >= 1.38
 * - South: lat <= 1.27
 * - East: lon >= 103.9 (excluding north/south extremes)
 * - West: lon <= 103.75 (excluding north/south extremes)
 * - Central: everything else
 */
export function getRegionFromCoordinates(lat: number, lon: number): SingaporeRegion {
    // Check north/south first (latitude takes priority)
    if (lat >= 1.38) {
        return "north";
    }
    if (lat <= 1.27) {
        return "south";
    }
    
    // Check east/west (longitude)
    if (lon >= 103.9) {
        return "east";
    }
    if (lon <= 103.75) {
        return "west";
    }
    
    // Default to central
    return "central";
}
