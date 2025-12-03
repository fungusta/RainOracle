import { describe, it, expect } from "vitest";
import { combineWeatherForecasts } from "./forecastCombiner";
import { Gov2HourForecast } from "@/types/weather/gov2hour";
import { Gov24HourForecast } from "@/types/weather/gov24hour";
import { OpenWeatherHourlyForecast } from "@/types/weather/openweatherHourly";

describe("combineWeatherForecasts", () => {
  const mockOpenWeatherForecast: OpenWeatherHourlyForecast = {
    temp: 30.5,
    feels_like: 35.2,
    temp_min: 28.0,
    temp_max: 32.0,
    pressure: 1012,
    humidity: 75,
    rain: 0.5,
    pop: 0.65,
  };

  describe("with Gov2HourForecast", () => {
    const mockGov2HourForecast: Gov2HourForecast = {
      nearestStation: "Clementi",
      forecast: "Light Rain",
    };

    it("should combine temp from OpenWeather", () => {
      const result = combineWeatherForecasts(mockGov2HourForecast, mockOpenWeatherForecast);
      expect(result.temp).toBe(30.5);
    });

    it("should combine feels_like from OpenWeather", () => {
      const result = combineWeatherForecasts(mockGov2HourForecast, mockOpenWeatherForecast);
      expect(result.feels_like).toBe(35.2);
    });

    it("should combine rain from OpenWeather", () => {
      const result = combineWeatherForecasts(mockGov2HourForecast, mockOpenWeatherForecast);
      expect(result.rain).toBe(0.5);
    });

    it("should combine pop from OpenWeather", () => {
      const result = combineWeatherForecasts(mockGov2HourForecast, mockOpenWeatherForecast);
      expect(result.pop).toBe(0.65);
    });

    it("should use forecast from Gov2HourForecast", () => {
      const result = combineWeatherForecasts(mockGov2HourForecast, mockOpenWeatherForecast);
      expect(result.forecast).toBe("Light Rain");
    });

    it("should return correct UnifiedWeatherForecast structure", () => {
      const result = combineWeatherForecasts(mockGov2HourForecast, mockOpenWeatherForecast);
      
      expect(result).toEqual({
        temp: 30.5,
        feels_like: 35.2,
        rain: 0.5,
        pop: 0.65,
        forecast: "Light Rain",
      });
    });
  });

  describe("with Gov24HourForecast", () => {
    const mockGov24HourForecast: Gov24HourForecast = {
      nearestStation: "Bukit Timah",
      forecast: "Thundery Showers",
    };

    it("should use forecast from Gov24HourForecast", () => {
      const result = combineWeatherForecasts(mockGov24HourForecast, mockOpenWeatherForecast);
      expect(result.forecast).toBe("Thundery Showers");
    });

    it("should return correct UnifiedWeatherForecast with Gov24HourForecast", () => {
      const result = combineWeatherForecasts(mockGov24HourForecast, mockOpenWeatherForecast);
      
      expect(result).toEqual({
        temp: 30.5,
        feels_like: 35.2,
        rain: 0.5,
        pop: 0.65,
        forecast: "Thundery Showers",
      });
    });
  });

  describe("edge cases", () => {
    it("should handle zero rain", () => {
      const noRainForecast: OpenWeatherHourlyForecast = {
        ...mockOpenWeatherForecast,
        rain: 0,
        pop: 0,
      };
      const govForecast: Gov2HourForecast = {
        nearestStation: "Marina Bay",
        forecast: "Fair",
      };

      const result = combineWeatherForecasts(govForecast, noRainForecast);
      
      expect(result.rain).toBe(0);
      expect(result.pop).toBe(0);
      expect(result.forecast).toBe("Fair");
    });

    it("should handle heavy rain values", () => {
      const heavyRainForecast: OpenWeatherHourlyForecast = {
        ...mockOpenWeatherForecast,
        rain: 15.5,
        pop: 1.0,
      };
      const govForecast: Gov2HourForecast = {
        nearestStation: "Changi",
        forecast: "Heavy Thundery Showers with Gusty Winds",
      };

      const result = combineWeatherForecasts(govForecast, heavyRainForecast);
      
      expect(result.rain).toBe(15.5);
      expect(result.pop).toBe(1.0);
      expect(result.forecast).toBe("Heavy Thundery Showers with Gusty Winds");
    });

    it("should handle negative feels_like (cold weather)", () => {
      const coldForecast: OpenWeatherHourlyForecast = {
        ...mockOpenWeatherForecast,
        temp: 5.0,
        feels_like: -2.0,
      };
      const govForecast: Gov2HourForecast = {
        nearestStation: "Woodlands",
        forecast: "Cloudy",
      };

      const result = combineWeatherForecasts(govForecast, coldForecast);
      
      expect(result.temp).toBe(5.0);
      expect(result.feels_like).toBe(-2.0);
    });
  });
});

