import { describe, it, expect } from "vitest";
import { parseOpenWeatherForecast } from "./openWeatherParser";
import { OpenWeatherHourlyResponse } from "@/types/weather/openweatherHourly";
import { convertFahrenheitToCelsius } from "@/utils/temperature";

describe("parseOpenWeatherForecast", () => {
  const mockResponse: OpenWeatherHourlyResponse = {
    cod: "200",
    message: 0,
    cnt: 96,
    list: [
      {
        dt: 1764738000,
        dt_txt: "2025-12-03 05:00:00",
        main: {
          temp: 305.38,
          feels_like: 310.46,
          temp_min: 302.56,
          temp_max: 305.38,
          pressure: 1011,
          humidity: 59,
        },
        weather: [
          {
            id: 803,
            main: "Clouds",
            description: "broken clouds",
            icon: "04d",
          },
        ],
        clouds: { all: 75 },
        wind: { speed: 2.79, deg: 222, gust: 2.44 },
        visibility: 10000,
        pop: 0.01,
        rain: { "1h": 0.0 },
        sys: { pod: "d" },
      },
      {
        dt: 1764741600,
        dt_txt: "2025-12-03 06:00:00",
        main: {
          temp: 304.78,
          feels_like: 309.95,
          temp_min: 302.4,
          temp_max: 304.78,
          pressure: 1011,
          humidity: 62,
        },
        weather: [
          {
            id: 803,
            main: "Clouds",
            description: "broken clouds",
            icon: "04d",
          },
        ],
        clouds: { all: 70 },
        wind: { speed: 3.18, deg: 213, gust: 2.73 },
        visibility: 10000,
        pop: 0.03,
        rain: { "1h": 0.0 },
        sys: { pod: "d" },
      },
      {
        dt: 1764777600,
        dt_txt: "2025-12-03 16:00:00",
        main: {
          temp: 300.22,
          feels_like: 303.14,
          temp_min: 300.22,
          temp_max: 300.22,
          pressure: 1012,
          humidity: 81,
        },
        weather: [
          {
            id: 500,
            main: "Rain",
            description: "light rain",
            icon: "10n",
          },
        ],
        clouds: { all: 97 },
        wind: { speed: 3.62, deg: 35, gust: 3.85 },
        visibility: 10000,
        pop: 0.26,
        rain: { "1h": 0.12 },
        sys: { pod: "n" },
      },
      {
        dt: 1764799200,
        dt_txt: "2025-12-03 22:00:00",
        main: {
          temp: 299.01,
          feels_like: 299.87,
          temp_min: 299.01,
          temp_max: 299.01,
          pressure: 1010,
          humidity: 85,
        },
        weather: [
          {
            id: 501,
            main: "Rain",
            description: "moderate rain",
            icon: "10n",
          },
        ],
        clouds: { all: 100 },
        wind: { speed: 4.07, deg: 17, gust: 4.76 },
        visibility: 10000,
        pop: 0.93,
        rain: { "1h": 1.44 },
        sys: { pod: "n" },
      },
    ],
    city: {
      id: 1882118,
      name: "Tanglin Halt",
      coord: { lat: 1.292, lon: 103.7767 },
      country: "SG",
      timezone: 28800,
      sunrise: 1764715999,
      sunset: 1764759377,
    },
  };

  it("should return forecast for exact timestamp match", () => {
    // dt: 1764799200 corresponds to "2025-12-03 22:00:00" UTC
    const datetime = new Date(1764799200 * 1000);
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    expect(result.pop).toBe(0.93);
    expect(result.rain).toEqual(1.44);
    expect(result.pressure).toBe(1010);
    expect(result.humidity).toBe(85);
  });

  it("should return closest forecast when datetime falls between forecast times", () => {
    // Timestamp between 1764738000 (05:00) and 1764741600 (06:00)
    // 1764739800 is exactly 30 minutes after 05:00, should pick 05:00 as it's equal distance (or first)
    const datetime = new Date(1764739000 * 1000); // Closer to 05:00
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    expect(result.pop).toBe(0.01); // First item's pop
    expect(result.pressure).toBe(1011);
    expect(result.humidity).toBe(59);
  });

  it("should return closest forecast when datetime is closer to second item", () => {
    // 1764740800 is closer to 1764741600 (06:00) than to 1764738000 (05:00)
    const datetime = new Date(1764740800 * 1000);
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    expect(result.pop).toBe(0.03); // Second item's pop
    expect(result.humidity).toBe(62);
  });

  it("should handle forecast with rain data", () => {
    const datetime = new Date(1764777600 * 1000); // Light rain forecast
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    expect(result.rain).toEqual(0.12);
    expect(result.pop).toBe(0.26);
  });

  it("should handle forecast without rain data", () => {
    const datetime = new Date(1764738000 * 1000); // No rain forecast
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    // When there's no rain, rain should be undefined or handled gracefully
    expect(result.rain).toEqual(0);
    expect(result.pop).toBe(0.01);
  });

  it("should throw error when list is empty", () => {
    const emptyResponse: OpenWeatherHourlyResponse = {
      ...mockResponse,
      list: [],
    };

    expect(() => parseOpenWeatherForecast(emptyResponse, new Date())).toThrow(
      "No forecast items found in response"
    );
  });

  it("should throw error when list is undefined", () => {
    const undefinedListResponse = {
      ...mockResponse,
      list: undefined,
    } as unknown as OpenWeatherHourlyResponse;

    expect(() =>
      parseOpenWeatherForecast(undefinedListResponse, new Date())
    ).toThrow("No forecast items found in response");
  });

  it("should convert temperature from Fahrenheit to Celsius", () => {
    const datetime = new Date(1764799200 * 1000);
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    expect(result.temp).toBeCloseTo(convertFahrenheitToCelsius(299.01), 2);
    expect(result.feels_like).toBeCloseTo(convertFahrenheitToCelsius(299.87), 2);
  });

  it("should return correct pressure and humidity values", () => {
    const datetime = new Date(1764799200 * 1000);
    const result = parseOpenWeatherForecast(mockResponse, datetime);

    expect(result.pressure).toBe(1010);
    expect(result.humidity).toBe(85);
  });
});

