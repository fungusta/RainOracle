import { GovForecastType } from "./gov";
import { OpenWeatherCondition } from "./openweatherHourly";

export interface UnifiedWeatherForecast {
  temp: number | null;
  feels_like: number | null;
  rain: number | null;
  pop: number | null;
  forecast: GovForecastType | OpenWeatherCondition | string;
}
