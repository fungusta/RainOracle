import { Gov2HourForecast, Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourForecast, Gov24HourResponse } from "@/types/weather/gov24hour";
import { OpenWeatherHourlyForecast, OpenWeatherHourlyResponse } from "@/types/weather/openweatherHourly";
import { UnifiedWeatherForecast } from "@/types/weather/weatherForecast";
import {
  parseGov2HourForecast,
  parseGov24HourForecast,
} from "@/lib/parsers/govParser";
import { parseOpenWeatherForecast } from "@/lib/parsers/openWeatherParser";
import { combineWeatherForecasts } from "./forecastCombiner";

interface ParseWeatherParams {
  lat: number;
  lon: number;
  datetime: Date;
  dataGov2h?: Gov2HourResponse;
  dataGov24h?: Gov24HourResponse;
  openWeather?: OpenWeatherHourlyResponse;
}

export function parseWeatherForecast({
  lat,
  lon,
  datetime,
  dataGov2h,
  dataGov24h,
  openWeather,
}: ParseWeatherParams): UnifiedWeatherForecast {
  const openWeatherForecast: OpenWeatherHourlyForecast | null = openWeather
    ? parseOpenWeatherForecast(openWeather, datetime)
    : null;

  const parseGovForecast = ():
    | Gov2HourForecast
    | Gov24HourForecast
    | null => {
    if (dataGov2h) {
      try {
        return parseGov2HourForecast(dataGov2h, lat, lon);
      } catch (error) {
        console.error("Error parsing Gov 2-hour forecast:", error);
      }
    } else if (dataGov24h) {
      try {
        return parseGov24HourForecast(dataGov24h, lat, lon, datetime);
      } catch (error) {
        console.error("Error parsing Gov 24-hour forecast:", error);
      }
    } 
    return null;
  };

  const govForecast = parseGovForecast();

  return combineWeatherForecasts(govForecast, openWeatherForecast);
}
