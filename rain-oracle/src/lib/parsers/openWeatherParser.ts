import { OpenWeatherHourlyResponse, OpenWeatherHourlyForecast } from "@/types/weather/openweatherHourly";
import { convertKelvinToCelsius } from "@/utils/temperature";

export function parseOpenWeatherForecast(data: OpenWeatherHourlyResponse, datetime: Date): OpenWeatherHourlyForecast {
    if (!data.list || data.list.length === 0) {
        throw new Error("No forecast items found in response");
    }
    
    const targetTimestamp = Math.floor(datetime.getTime() / 1000);
    
    // Find the forecast item closest to the given datetime (Usually the first item)
    const closestItem = data.list.reduce((closest, current) => {
        return Math.abs(current.dt - targetTimestamp) < Math.abs(closest.dt - targetTimestamp) 
            ? current 
            : closest;
    }, data.list[0]);
    
    const weatherCondition = closestItem.weather?.[0];

    return {
        temp: convertKelvinToCelsius(closestItem.main.temp),
        feels_like: convertKelvinToCelsius(closestItem.main.feels_like),
        temp_min: convertKelvinToCelsius(closestItem.main.temp_min),
        temp_max: convertKelvinToCelsius(closestItem.main.temp_max),
        pressure: closestItem.main.pressure,
        humidity: closestItem.main.humidity,
        rain: closestItem.rain?.["1h"] ?? 0.0,
        pop: closestItem.pop,
        condition: weatherCondition?.main ?? "",
        description: weatherCondition?.description ?? ""
    };
}