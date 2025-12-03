import { GovForecastType } from "./gov";

export interface UnifiedWeatherForecast {
  temp: number;
  feels_like: number;
  rain: number;
  pop: number;
  forecast: GovForecastType;
}
