import { Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourResponse } from "@/types/weather/gov24hour";
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

  let openWeatherForecast: OpenWeatherHourlyForecast | null = null;
  if (openWeather) {
    openWeatherForecast = parseOpenWeatherForecast(openWeather, datetime);
  }
  
  console.log(openWeatherForecast);

  if (dataGov2h) {
    const govForecast = parseGov2HourForecast(dataGov2h, lat, lon);
    return combineWeatherForecasts(govForecast, openWeatherForecast);
  }

  if (dataGov24h) {
    const govForecast = parseGov24HourForecast(dataGov24h, lat, lon, datetime);
    return combineWeatherForecasts(govForecast, openWeatherForecast);
  }

  return combineWeatherForecasts(null, openWeatherForecast);
}
