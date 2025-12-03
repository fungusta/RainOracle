import { Gov2HourForecast } from "@/types/weather/gov2hour";
import { UnifiedWeatherForecast } from "@/types/weather/weatherForecast";
import { OpenWeatherCondition, OpenWeatherHourlyForecast } from "@/types/weather/openweatherHourly";
import { Gov24HourForecast } from "@/types/weather/gov24hour";
import { GovForecastType } from "@/types/weather/gov";

export function combineWeatherForecasts(govForecast: Gov2HourForecast | Gov24HourForecast | null, openWeatherForecast: OpenWeatherHourlyForecast | null): UnifiedWeatherForecast {
    console.log(govForecast);
    console.log(openWeatherForecast);
    return {
        temp: openWeatherForecast?.temp ?? null,
        feels_like: openWeatherForecast?.feels_like ?? null,
        rain: openWeatherForecast?.rain ?? null,
        pop: openWeatherForecast?.pop ?? null,
        forecast: govForecast?.forecast ?? (openWeatherForecast?.description as GovForecastType | OpenWeatherCondition | string)
    };
}