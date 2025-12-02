import { formatDateTime, getCurrentHour, getHoursFromNow } from "./dateTimeUtils";
import { Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourResponse } from "@/types/weather/gov24hour";
import { OpenWeatherHourlyResponse } from "@/types/weather/openweatherHourly";
import { NEA_ENDPOINTS, OPENWEATHER_ENDPOINTS } from "@/constants/weather";
import { ENV } from "@/constants/env";


async function fetchDataGov2Hour(datetime: Date): Promise<Gov2HourResponse> { 
    console.log(`${NEA_ENDPOINTS.TWO_HOUR_FORECAST}?date=${formatDateTime(datetime)}`);
    const response = await fetch(`${NEA_ENDPOINTS.TWO_HOUR_FORECAST}?date=${formatDateTime(datetime)}`, {
        headers: {
            "x-api-key": ENV.SG_WEATHER_API_KEY
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch dataGov2Hour: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function fetchDataGov24Hour(datetime: Date): Promise<Gov24HourResponse> { 
    console.log(`${NEA_ENDPOINTS.TWENTY_FOUR_HOUR_FORECAST}?date=${formatDateTime(datetime)}`);
    const response = await fetch(`${NEA_ENDPOINTS.TWENTY_FOUR_HOUR_FORECAST}?date=${formatDateTime(datetime)}`, {
        headers: {
            "x-api-key": ENV.SG_WEATHER_API_KEY
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch dataGov24Hour: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function fetchOpenWeatherHourly(lat: number, lon: number): Promise<OpenWeatherHourlyResponse> {
    console.log(`${OPENWEATHER_ENDPOINTS.HOURLY_FORECAST}?lat=${lat}&lon=${lon}&appid=${ENV.OPENWEATHER_API_KEY}`);
    const response = await fetch(`${OPENWEATHER_ENDPOINTS.HOURLY_FORECAST}?lat=${lat}&lon=${lon}&appid=${ENV.OPENWEATHER_API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch openWeatherHourly: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export async function getWeatherData(lat: number, lon: number, datetime: Date)  {
  const hoursFromNow = getHoursFromNow(datetime.getHours(), getCurrentHour());
  
  if (hoursFromNow <= 2) {
    const [dataGov2h, openWeather] = await Promise.all([
      fetchDataGov2Hour(datetime),
      fetchOpenWeatherHourly(lat, lon)
    ]);

    console.log(dataGov2h);
    return {
      dataGov2h,
      openWeather
    };
  } else if (hoursFromNow <= 24) {
    const [dataGov24h, openWeather] = await Promise.all([
      fetchDataGov24Hour(datetime),
      fetchOpenWeatherHourly(lat, lon)
    ]);

    console.log(dataGov24h);
    return {
      dataGov24h,
      openWeather
    };
  } else {
    return {
      error: "Weather data not available for this datetime",
      status: 400
    };
  }
}