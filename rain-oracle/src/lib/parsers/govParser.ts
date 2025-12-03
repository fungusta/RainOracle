import { Gov24HourForecast, Gov24HourResponse } from "@/types/weather/gov24hour";
import { Gov2HourForecast, Gov2HourResponse } from "@/types/weather/gov2hour";
import { AreaMetadata } from "@/types/weather/gov";
import { calculateDistance } from "@/utils/distance";
import { getRegionFromCoordinates } from "@/utils/location";

export function parseGov2HourForecast(data: Gov2HourResponse, lat: number, lon: number): Gov2HourForecast {
    if (!data.data.area_metadata || data.data.area_metadata.length === 0) {
        throw new Error("No area metadata found in response");
    }
    
    if (!data.data.items || data.data.items.length === 0) {
        throw new Error("No forecast items found in response");
    }
    
    const nearestStation = findNearestStation(data.data.area_metadata, lat, lon);
    const nearestStationForecast = data.data.items[0].forecasts.find((forecast) => forecast.area === nearestStation)?.forecast || "Fair";
    return {
        nearestStation: nearestStation,
        forecast: nearestStationForecast
    };
}

export function parseGov24HourForecast(data: Gov24HourResponse, lat: number, lon: number, datetime: Date): Gov24HourForecast {
    const latestRecord = data.data.records.find((record) => record.date === datetime.toISOString().split('T')[0]);
    if (!latestRecord) {
        throw new Error("No record found for the given datetime");
    }
    
    // Find the period whose timePeriod contains the datetime
    const period = latestRecord.periods.find((p) => {
        const start = new Date(p.timePeriod.start).getTime();
        const end = new Date(p.timePeriod.end).getTime();
        return datetime.getTime() >= start && datetime.getTime() < end;
    });
    
    if (!period) {
        throw new Error("No period found for the given datetime");
    }
    
    const region = getRegionFromCoordinates(lat, lon);
    const regionForecast = period.regions[region];
    
    return {
        nearestStation: region,
        forecast: regionForecast.text || "Fair"
    };
}

function findNearestStation(areaMetadata: AreaMetadata[], lat: number, lon: number): string {
    return areaMetadata.reduce((nearest, current) => {
        return calculateDistance(lat, lon, current.label_location.latitude, current.label_location.longitude) < calculateDistance(lat, lon, nearest.label_location.latitude, nearest.label_location.longitude) ? current : nearest;
    }, areaMetadata[0]).name;
}