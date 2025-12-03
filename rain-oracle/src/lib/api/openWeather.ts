import { ENV } from "@/constants/env";
import { OPENWEATHER_ENDPOINTS } from "@/constants/weather";
import { OpenWeatherHourlyResponse } from "@/types/weather/openweatherHourly";

export async function fetchOpenWeatherHourly(lat: number, lon: number): Promise<OpenWeatherHourlyResponse> {
    console.log(`${OPENWEATHER_ENDPOINTS.HOURLY_FORECAST}?lat=${lat}&lon=${lon}&appid=${ENV.OPENWEATHER_API_KEY}`);
    const response = await fetch(`${OPENWEATHER_ENDPOINTS.HOURLY_FORECAST}?lat=${lat}&lon=${lon}&appid=${ENV.OPENWEATHER_API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch openWeatherHourly: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}