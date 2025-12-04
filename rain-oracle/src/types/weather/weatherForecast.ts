import { WeatherCondition } from "./weatherCondition";

export interface UnifiedWeatherForecast {
  temp: number | null;
  feels_like: number | null;
  rain: number | null;
  pop: number | null;
  forecast: WeatherCondition | string;
}
