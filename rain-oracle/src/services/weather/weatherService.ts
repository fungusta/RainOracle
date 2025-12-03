import { getCurrentHour, getHoursFromNow } from "@/utils/dateTimeUtils";
import { fetchDataGov2Hour, fetchDataGov24Hour } from "@/lib/api/gov";
import { fetchOpenWeatherHourly } from "@/lib/api/openWeather";
import { parseWeatherForecast } from "./weatherParserService";

export async function getWeatherForecast(lat: number, lon: number, datetime: Date)  {
    const hoursFromNow = getHoursFromNow(datetime.getHours(), getCurrentHour());
    
    if (hoursFromNow <= 2) {
      const [dataGov2h, openWeather] = await Promise.all([
        fetchDataGov2Hour(datetime),
        fetchOpenWeatherHourly(lat, lon)
      ]);
  
      const weatherForecast = parseWeatherForecast({
        lat,
        lon,
        datetime,
        dataGov2h,
        openWeather
      });

      return weatherForecast;
    } else if (hoursFromNow <= 24) {
      const [dataGov24h, openWeather] = await Promise.all([
        fetchDataGov24Hour(datetime),
        fetchOpenWeatherHourly(lat, lon)
      ]);
  
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