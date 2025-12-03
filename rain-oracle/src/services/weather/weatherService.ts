import { getCurrentHour, getHoursFromNow } from "@/utils/dateTimeUtils";
import { fetchDataGov2Hour, fetchDataGov24Hour } from "@/lib/api/gov";
import { fetchOpenWeatherHourly } from "@/lib/api/openWeather";
import { parseWeatherForecast } from "./weatherParserService";

export async function getWeatherForecast(lat: number, lon: number, datetime: Date)  {
    const hoursFromNow = getHoursFromNow(datetime.getHours(), getCurrentHour());
    
    if (hoursFromNow <= 2) {
      const [dataGov2hResult, openWeatherResult] = await Promise.allSettled([
        fetchDataGov2Hour(datetime),
        fetchOpenWeatherHourly(lat, lon)
      ]);
  
      const dataGov2h = dataGov2hResult.status === 'fulfilled' ? dataGov2hResult.value : undefined;
      const openWeather = openWeatherResult.status === 'fulfilled' ? openWeatherResult.value : undefined;
      
      // Only throw if BOTH APIs failed
      if (!dataGov2h && !openWeather) {
        throw new Error("Both APIs failed: openWeather and dataGov2h");
      }

      const weatherForecast = parseWeatherForecast({
        lat,
        lon,
        datetime,
        dataGov2h,
        openWeather
      });

      return weatherForecast;
    } else if (hoursFromNow <= 24) {
      const [dataGov24hResult, openWeatherResult] = await Promise.allSettled([
        fetchDataGov24Hour(datetime),
        fetchOpenWeatherHourly(lat, lon)
      ]);
  
      const dataGov24h = dataGov24hResult.status === 'fulfilled' ? dataGov24hResult.value : undefined;
      const openWeather = openWeatherResult.status === 'fulfilled' ? openWeatherResult.value : undefined;
      
      // Only throw if BOTH APIs failed
      if (!dataGov24h && !openWeather) {
        throw new Error("Both APIs failed: openWeather and dataGov24h");
      }

      const weatherForecast = parseWeatherForecast({
        lat,
        lon,
        datetime,
        dataGov24h,
        openWeather
      });

      return weatherForecast;
    } else {
      throw new Error("Weather data not available for this datetime");
    }
  }