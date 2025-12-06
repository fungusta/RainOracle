export type SingaporeRegion = "north" | "south" | "east" | "west" | "central";

export type LocationName =
    // Central
    | "Orchard"
    | "Somerset"
    | "Dhoby Ghaut"
    | "Bugis"
    | "Marina Bay"
    | "Chinatown"
    | "Novena"
    | "Toa Payoh"
    | "Bishan"
    // East
    | "Tampines"
    | "Pasir Ris"
    | "Bedok"
    | "Changi Airport"
    | "Paya Lebar"
    | "Marine Parade"
    // West
    | "Jurong East"
    | "Jurong West"
    | "Clementi"
    | "Bukit Batok"
    | "Bukit Panjang"
    | "Bukit Timah"
    // North
    | "Yishun"
    | "Sembawang"
    | "Woodlands"
    | "Ang Mo Kio"
    | "Hougang"
    // South
    | "HarbourFront"
    | "Sentosa"
    | "Telok Blangah";

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface LocationInfo {
    coords: Coordinates;
    area: SingaporeRegion;
}

export type LocationErrorType = "permission_denied" | "position_unavailable" | "timeout" | "not_supported" | "unknown";

export class LocationError extends Error {
    type: LocationErrorType;
    
    constructor(type: LocationErrorType, message: string) {
        super(message);
        this.type = type;
        this.name = "LocationError";
    }
    
    static fromGeolocationError(error: GeolocationPositionError): LocationError {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return new LocationError("permission_denied", "Location permission was denied. Please enable location access in your browser settings.");
            case error.POSITION_UNAVAILABLE:
                return new LocationError("position_unavailable", "Unable to determine your location. Please try again or select a location manually.");
            case error.TIMEOUT:
                return new LocationError("timeout", "Location request timed out. Please try again.");
            default:
                return new LocationError("unknown", "An unknown error occurred while getting your location.");
        }
    }
}

/**
 * Mapping of location names to their coordinates and area in Singapore
 */
const LOCATION_COORDINATES: Record<LocationName, LocationInfo> = {
    // Central
    "Orchard": { coords: { lat: 1.3048, lon: 103.8318 }, area: "central" },
    "Somerset": { coords: { lat: 1.3004, lon: 103.8388 }, area: "central" },
    "Dhoby Ghaut": { coords: { lat: 1.2996, lon: 103.8453 }, area: "central" },
    "Bugis": { coords: { lat: 1.3000, lon: 103.8553 }, area: "central" },
    "Marina Bay": { coords: { lat: 1.2814, lon: 103.8585 }, area: "central" },
    "Chinatown": { coords: { lat: 1.2837, lon: 103.8438 }, area: "central" },
    "Novena": { coords: { lat: 1.3204, lon: 103.8438 }, area: "central" },
    "Toa Payoh": { coords: { lat: 1.3327, lon: 103.8505 }, area: "central" },
    "Bishan": { coords: { lat: 1.3526, lon: 103.8352 }, area: "central" },
    // East
    "Tampines": { coords: { lat: 1.3496, lon: 103.9568 }, area: "east" },
    "Pasir Ris": { coords: { lat: 1.3723, lon: 103.9488 }, area: "east" },
    "Bedok": { coords: { lat: 1.3236, lon: 103.9273 }, area: "east" },
    "Changi Airport": { coords: { lat: 1.3576, lon: 103.9885 }, area: "east" },
    "Paya Lebar": { coords: { lat: 1.3175, lon: 103.8924 }, area: "east" },
    "Marine Parade": { coords: { lat: 1.3027, lon: 103.9074 }, area: "east" },
    // West
    "Jurong East": { coords: { lat: 1.3329, lon: 103.7436 }, area: "west" },
    "Jurong West": { coords: { lat: 1.3396, lon: 103.7073 }, area: "west" },
    "Clementi": { coords: { lat: 1.3151, lon: 103.7652 }, area: "west" },
    "Bukit Batok": { coords: { lat: 1.3484, lon: 103.7464 }, area: "west" },
    "Bukit Panjang": { coords: { lat: 1.3800, lon: 103.7727 }, area: "west" },
    "Bukit Timah": { coords: { lat: 1.3294, lon: 103.8021 }, area: "west" },
    // North
    "Yishun": { coords: { lat: 1.4265, lon: 103.8372 }, area: "north" },
    "Sembawang": { coords: { lat: 1.4491, lon: 103.8201 }, area: "north" },
    "Woodlands": { coords: { lat: 1.4349, lon: 103.7872 }, area: "north" },
    "Ang Mo Kio": { coords: { lat: 1.3713, lon: 103.8470 }, area: "north" },
    "Hougang": { coords: { lat: 1.3710, lon: 103.8944 }, area: "north" },
    // South
    "HarbourFront": { coords: { lat: 1.2644, lon: 103.8203 }, area: "south" },
    "Sentosa": { coords: { lat: 1.2489, lon: 103.8343 }, area: "south" },
    "Telok Blangah": { coords: { lat: 1.2725, lon: 103.8118 }, area: "south" },
};

/**
 * Get all location names
 */
export function getAllLocations(): LocationName[] {
    return Object.keys(LOCATION_COORDINATES) as LocationName[];
}

/**
 * Get all locations grouped by area
 */
export function getLocationsByArea(): Record<SingaporeRegion, LocationName[]> {
    const grouped: Record<SingaporeRegion, LocationName[]> = {
        central: [],
        north: [],
        east: [],
        west: [],
        south: [],
    };

    for (const [name, info] of Object.entries(LOCATION_COORDINATES)) {
        grouped[info.area].push(name as LocationName);
    }

    // Sort each area's locations alphabetically
    for (const area of Object.keys(grouped) as SingaporeRegion[]) {
        grouped[area].sort();
    }

    return grouped;
}

/**
 * Maps a location name to its coordinates
 * @param locationName - The name of the location
 * @returns The coordinates (lat, lon) for the location, or null if location not found
 */
export async function getCoordinatesFromLocation(locationName: string): Promise<Coordinates | null> {
    if (locationName in LOCATION_COORDINATES) {
        return LOCATION_COORDINATES[locationName as LocationName].coords;
    } else if (locationName === "Current Location") {
        const pos = await getUserLocation();
        return { lat: pos.coords.latitude, lon: pos.coords.longitude };
    }
    return null;
}

/**
 * Gets the area/region for a location
 * @param locationName - The name of the location
 * @returns The area/region for the location, or null if location not found
 */
export function getAreaFromLocation(locationName: string): SingaporeRegion | null {
    if (locationName in LOCATION_COORDINATES) {
        return LOCATION_COORDINATES[locationName as LocationName].area;
    }
    return null;
}

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

function getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new LocationError("not_supported", "Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => reject(LocationError.fromGeolocationError(error)),
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
            }
        );
    });
}
