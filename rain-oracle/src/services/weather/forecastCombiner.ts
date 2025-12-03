import { Gov2HourForecast } from "@/types/weather/gov2hour";
import { UnifiedWeatherForecast } from "@/types/weather/weatherForecast";
import { OpenWeatherHourlyForecast } from "@/types/weather/openweatherHourly";
import { Gov24HourForecast } from "@/types/weather/gov24hour";

export function combineWeatherForecasts(govForecast: Gov2HourForecast | Gov24HourForecast, openWeatherForecast: OpenWeatherHourlyForecast): UnifiedWeatherForecast {
    return {
        temp: openWeatherForecast.temp,
        feels_like: openWeatherForecast.feels_like,
        rain: openWeatherForecast.rain,
        pop: openWeatherForecast.pop,
        forecast: govForecast.forecast
    };
}