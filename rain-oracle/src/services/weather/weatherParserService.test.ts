import { describe, it, expect } from "vitest";
import { parseWeatherForecast } from "./weatherParserService";
import { Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourResponse } from "@/types/weather/gov24hour";
import { OpenWeatherHourlyResponse } from "@/types/weather/openweatherHourly";

describe("parseWeatherForecast", () => {
  // Mock OpenWeather response (used in all tests)
  const mockOpenWeatherResponse: OpenWeatherHourlyResponse = {
    cod: "200",
    message: 0,
    cnt: 4,
    list: [
      {
        dt: 1733220000, // 2024-12-03T10:00:00Z
        dt_txt: "2024-12-03 10:00:00",
        main: {
          temp: 303.15, // ~30°C in Kelvin
          feels_like: 308.15,
          temp_min: 301.15,
          temp_max: 305.15,
          pressure: 1010,
          humidity: 70,
        },
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
        clouds: { all: 75 },
        wind: { speed: 3.5, deg: 180 },
        visibility: 10000,
        pop: 0.65,
        rain: { "1h": 0.5 },
        sys: { pod: "d" },
      },
      {
        dt: 1733223600, // 2024-12-03T11:00:00Z
        dt_txt: "2024-12-03 11:00:00",
        main: {
          temp: 304.15,
          feels_like: 309.15,
          temp_min: 302.15,
          temp_max: 306.15,
          pressure: 1011,
          humidity: 68,
        },
        weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
        clouds: { all: 80 },
        wind: { speed: 4.0, deg: 190 },
        visibility: 10000,
        pop: 0.70,
        rain: { "1h": 0.8 },
        sys: { pod: "d" },
      },
    ],
    city: {
      id: 1880252,
      name: "Singapore",
      coord: { lat: 1.29, lon: 103.85 },
      country: "SG",
      timezone: 28800,
      sunrise: 1733182800,
      sunset: 1733226000,
    },
  };

  // Mock Gov 2-hour response
  const mockGov2HourResponse: Gov2HourResponse = {
    code: 0,
    errorMsg: null,
    data: {
      area_metadata: [
        { name: "Clementi", label_location: { latitude: 1.315, longitude: 103.76 } },
        { name: "Bedok", label_location: { latitude: 1.321, longitude: 103.924 } },
        { name: "City", label_location: { latitude: 1.292, longitude: 103.844 } },
      ],
      items: [
        {
          update_timestamp: "2024-12-03T10:00:00+08:00",
          timestamp: "2024-12-03T10:00:00+08:00",
          valid_period: {
            start: "2024-12-03T10:00:00+08:00",
            end: "2024-12-03T12:00:00+08:00",
            text: "10 am to 12 pm",
          },
          forecasts: [
            { area: "Clementi", forecast: "Light Showers" },
            { area: "Bedok", forecast: "Partly Cloudy (Day)" },
            { area: "City", forecast: "Thundery Showers" },
          ],
        },
      ],
    },
  };

  // Mock Gov 24-hour response
  const mockGov24HourResponse: Gov24HourResponse = {
    code: 0,
    errorMsg: null,
    data: {
      records: [
        {
          date: "2024-12-03",
          updatedTimestamp: "2024-12-03T06:00:00+08:00",
          timestamp: "2024-12-03T06:00:00+08:00",
          general: {
            temperature: { low: 25, high: 33, unit: "Degrees Celsius" },
            relativeHumidity: { low: 60, high: 95, unit: "Percentage" },
            forecast: { code: "TL", text: "Thundery Showers" },
            validPeriod: {
              start: "2024-12-03T06:00:00+08:00",
              end: "2024-12-04T06:00:00+08:00",
              text: "6 AM 3 Dec to 6 AM 4 Dec",
            },
            wind: { speed: { low: 5, high: 15 }, direction: "WSW" },
          },
          periods: [
            {
              timePeriod: {
                start: "2024-12-03T06:00:00+08:00",
                end: "2024-12-03T12:00:00+08:00",
                text: "6 am to Midday",
              },
              regions: {
                west: { code: "PC", text: "Partly Cloudy (Day)" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "SH", text: "Showers" },
                south: { code: "PC", text: "Partly Cloudy (Day)" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
            {
              timePeriod: {
                start: "2024-12-03T12:00:00+08:00",
                end: "2024-12-03T18:00:00+08:00",
                text: "Midday to 6 pm",
              },
              regions: {
                west: { code: "TL", text: "Thundery Showers" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "TL", text: "Thundery Showers" },
                south: { code: "TL", text: "Thundery Showers" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
          ],
        },
      ],
    },
  };

  describe("with Gov 2-hour data", () => {
    it("should return unified forecast combining Gov 2h and OpenWeather data", () => {
      const datetime = new Date(1733220000 * 1000); // matches first OpenWeather item
      const result = parseWeatherForecast({
        lat: 1.292,
        lon: 103.844,
        datetime,
        dataGov2h: mockGov2HourResponse,
        openWeather: mockOpenWeatherResponse,
      });

      expect(result).toHaveProperty("temp");
      expect(result).toHaveProperty("feels_like");
      expect(result).toHaveProperty("rain");
      expect(result).toHaveProperty("pop");
      expect(result).toHaveProperty("forecast");
      expect(result.forecast).toBe("Thundery Showers"); // City forecast
    });

    it("should use nearest station forecast from Gov 2h data", () => {
      const datetime = new Date(1733220000 * 1000);

      // Near Clementi
      const resultClementi = parseWeatherForecast({
        lat: 1.315,
        lon: 103.76,
        datetime,
        dataGov2h: mockGov2HourResponse,
        openWeather: mockOpenWeatherResponse,
      });
      expect(resultClementi.forecast).toBe("Light Showers");

      // Near Bedok
      const resultBedok = parseWeatherForecast({
        lat: 1.321,
        lon: 103.924,
        datetime,
        dataGov2h: mockGov2HourResponse,
        openWeather: mockOpenWeatherResponse,
      });
      expect(resultBedok.forecast).toBe("Partly Cloudy (Day)");
    });

    it("should include temperature data from OpenWeather", () => {
      const datetime = new Date(1733220000 * 1000);
      const result = parseWeatherForecast({
        lat: 1.292,
        lon: 103.844,
        datetime,
        dataGov2h: mockGov2HourResponse,
        openWeather: mockOpenWeatherResponse,
      });

      expect(result.temp).toBeDefined();
      expect(result.feels_like).toBeDefined();
    });

    it("should include precipitation data from OpenWeather", () => {
      const datetime = new Date(1733220000 * 1000);
      const result = parseWeatherForecast({
        lat: 1.292,
        lon: 103.844,
        datetime,
        dataGov2h: mockGov2HourResponse,
        openWeather: mockOpenWeatherResponse,
      });

      expect(result.rain).toBe(0.5);
      expect(result.pop).toBe(0.65);
    });
  });

  describe("with Gov 24-hour data", () => {
    // datetime in first period: 2024-12-03T06:00:00+08:00 to 2024-12-03T12:00:00+08:00
    // UTC: 2024-12-02T22:00:00Z to 2024-12-03T04:00:00Z
    const datetimePeriod1 = new Date("2024-12-03T00:00:00.000Z"); // 8am SGT

    it("should return unified forecast combining Gov 24h and OpenWeather data", () => {
      const result = parseWeatherForecast({
        lat: 1.30,
        lon: 103.85,
        datetime: datetimePeriod1,
        dataGov24h: mockGov24HourResponse,
        openWeather: mockOpenWeatherResponse,
      });

      expect(result).toHaveProperty("temp");
      expect(result).toHaveProperty("feels_like");
      expect(result).toHaveProperty("rain");
      expect(result).toHaveProperty("pop");
      expect(result).toHaveProperty("forecast");
      expect(result.forecast).toBe("Showers"); // Central region in period 1
    });

    it("should use correct region forecast based on coordinates", () => {
      // West region (lon <= 103.75)
      const westResult = parseWeatherForecast({
        lat: 1.33,
        lon: 103.7,
        datetime: datetimePeriod1,
        dataGov24h: mockGov24HourResponse,
        openWeather: mockOpenWeatherResponse,
      });
      expect(westResult.forecast).toBe("Partly Cloudy (Day)");

      // East region (lon >= 103.9)
      const eastResult = parseWeatherForecast({
        lat: 1.35,
        lon: 103.95,
        datetime: datetimePeriod1,
        dataGov24h: mockGov24HourResponse,
        openWeather: mockOpenWeatherResponse,
      });
      expect(eastResult.forecast).toBe("Thundery Showers");

      // North region (lat >= 1.38)
      const northResult = parseWeatherForecast({
        lat: 1.43,
        lon: 103.82,
        datetime: datetimePeriod1,
        dataGov24h: mockGov24HourResponse,
        openWeather: mockOpenWeatherResponse,
      });
      expect(northResult.forecast).toBe("Thundery Showers");
    });

    it("should use correct period based on datetime", () => {
      // Period 2: 2024-12-03T12:00:00+08:00 to 2024-12-03T18:00:00+08:00
      // UTC: 2024-12-03T04:00:00Z to 2024-12-03T10:00:00Z
      const datetimePeriod2 = new Date("2024-12-03T06:00:00.000Z"); // 2pm SGT

      const result = parseWeatherForecast({
        lat: 1.33,
        lon: 103.7,
        datetime: datetimePeriod2,
        dataGov24h: mockGov24HourResponse,
        openWeather: mockOpenWeatherResponse,
      });

      // West in period 2 is Thundery Showers (not Partly Cloudy like period 1)
      expect(result.forecast).toBe("Thundery Showers");
    });
  });

  describe("error handling", () => {
    it("should throw error when no government forecast data provided", () => {
      const datetime = new Date(1733220000 * 1000);

      expect(() =>
        parseWeatherForecast({
          lat: 1.292,
          lon: 103.844,
          datetime,
          openWeather: mockOpenWeatherResponse,
        })
      ).toThrow("No government forecast data provided");
    });

    it("should throw error when both Gov2h and Gov24h have invalid data", () => {
      const datetime = new Date(1733220000 * 1000);
      const emptyGov2h: Gov2HourResponse = {
        code: 0,
        errorMsg: null,
        data: {
          area_metadata: [],
          items: [],
        },
      };

      expect(() =>
        parseWeatherForecast({
          lat: 1.292,
          lon: 103.844,
          datetime,
          dataGov2h: emptyGov2h,
          openWeather: mockOpenWeatherResponse,
        })
      ).toThrow();
    });

    it("should throw error when OpenWeather data is empty", () => {
      const datetime = new Date(1733220000 * 1000);
      const emptyOpenWeather: OpenWeatherHourlyResponse = {
        ...mockOpenWeatherResponse,
        list: [],
      };

      expect(() =>
        parseWeatherForecast({
          lat: 1.292,
          lon: 103.844,
          datetime,
          dataGov2h: mockGov2HourResponse,
          openWeather: emptyOpenWeather,
        })
      ).toThrow("No forecast items found in response");
    });
  });

  describe("unified forecast structure", () => {
    it("should return all required fields in UnifiedWeatherForecast", () => {
      const datetime = new Date(1733220000 * 1000);
      const result = parseWeatherForecast({
        lat: 1.292,
        lon: 103.844,
        datetime,
        dataGov2h: mockGov2HourResponse,
        openWeather: mockOpenWeatherResponse,
      });

      expect(result).toEqual({
        temp: expect.any(Number),
        feels_like: expect.any(Number),
        rain: expect.any(Number),
        pop: expect.any(Number),
        forecast: expect.any(String),
      });
    });
  });
});

