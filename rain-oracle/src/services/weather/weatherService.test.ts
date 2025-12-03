import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getWeatherForecast } from "./weatherService";
import * as govApi from "@/lib/api/gov";
import * as openWeatherApi from "@/lib/api/openWeather";
import * as dateTimeUtils from "@/utils/dateTimeUtils";
import { Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourResponse } from "@/types/weather/gov24hour";
import { OpenWeatherHourlyResponse } from "@/types/weather/openweatherHourly";

// Mock the API modules
vi.mock("@/lib/api/gov");
vi.mock("@/lib/api/openWeather");
vi.mock("@/utils/dateTimeUtils", async (importOriginal) => {
  const original = await importOriginal<typeof dateTimeUtils>();
  return {
    ...original,
    getCurrentHour: vi.fn(),
    getHoursFromNow: vi.fn(),
  };
});

describe("getWeatherForecast", () => {
  const mockOpenWeatherResponse: OpenWeatherHourlyResponse = {
    cod: "200",
    message: 0,
    cnt: 2,
    list: [
      {
        dt: 1733220000,
        dt_txt: "2024-12-03 10:00:00",
        main: {
          temp: 303.15,
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

  const mockGov2HourResponse: Gov2HourResponse = {
    code: 0,
    errorMsg: null,
    data: {
      area_metadata: [
        { name: "City", label_location: { latitude: 1.292, longitude: 103.844 } },
        { name: "Clementi", label_location: { latitude: 1.315, longitude: 103.76 } },
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
            { area: "City", forecast: "Thundery Showers" },
            { area: "Clementi", forecast: "Light Showers" },
          ],
        },
      ],
    },
  };

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("for forecast within 2 hours", () => {
    beforeEach(() => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(10);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(1);
      vi.mocked(govApi.fetchDataGov2Hour).mockResolvedValue(mockGov2HourResponse);
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockResolvedValue(mockOpenWeatherResponse);
    });

    it("should fetch Gov 2-hour and OpenWeather data", async () => {
      const datetime = new Date("2024-12-03T11:00:00+08:00");

      await getWeatherForecast(1.29, 103.85, datetime);

      expect(govApi.fetchDataGov2Hour).toHaveBeenCalledWith(datetime);
      expect(openWeatherApi.fetchOpenWeatherHourly).toHaveBeenCalledWith(1.29, 103.85);
      expect(govApi.fetchDataGov24Hour).not.toHaveBeenCalled();
    });

    it("should return unified weather forecast", async () => {
      const datetime = new Date("2024-12-03T11:00:00+08:00");

      const result = await getWeatherForecast(1.29, 103.85, datetime);

      expect(result).toHaveProperty("temp");
      expect(result).toHaveProperty("feels_like");
      expect(result).toHaveProperty("rain");
      expect(result).toHaveProperty("pop");
      expect(result).toHaveProperty("forecast");
    });

    it("should use nearest station forecast from Gov 2h", async () => {
      const datetime = new Date("2024-12-03T11:00:00+08:00");

      // Near City area
      const result = await getWeatherForecast(1.292, 103.844, datetime);

      expect(result.forecast).toBe("Thundery Showers");
    });

    it("should fetch data in parallel", async () => {
      const datetime = new Date("2024-12-03T11:00:00+08:00");

      // Track call order
      const callOrder: string[] = [];
      vi.mocked(govApi.fetchDataGov2Hour).mockImplementation(async () => {
        callOrder.push("gov2h-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        callOrder.push("gov2h-end");
        return mockGov2HourResponse;
      });
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockImplementation(async () => {
        callOrder.push("openWeather-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        callOrder.push("openWeather-end");
        return mockOpenWeatherResponse;
      });

      await getWeatherForecast(1.29, 103.85, datetime);

      // Both should start before either ends (parallel execution)
      expect(callOrder.indexOf("gov2h-start")).toBeLessThan(callOrder.indexOf("gov2h-end"));
      expect(callOrder.indexOf("openWeather-start")).toBeLessThan(callOrder.indexOf("openWeather-end"));
      // Both start calls should happen before end calls
      expect(callOrder[0]).toContain("start");
      expect(callOrder[1]).toContain("start");
    });
  });

  describe("for forecast within 24 hours", () => {
    // datetime in first period: 2024-12-03T06:00:00+08:00 to 2024-12-03T12:00:00+08:00
    // UTC: 2024-12-02T22:00:00Z to 2024-12-03T04:00:00Z
    const datetime = new Date("2024-12-03T00:00:00.000Z"); // 8am SGT

    beforeEach(() => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(5);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(3); // More than 2, less than 24
      vi.mocked(govApi.fetchDataGov24Hour).mockResolvedValue(mockGov24HourResponse);
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockResolvedValue(mockOpenWeatherResponse);
    });

    it("should fetch Gov 24-hour and OpenWeather data", async () => {
      await getWeatherForecast(1.29, 103.85, datetime);

      expect(govApi.fetchDataGov24Hour).toHaveBeenCalledWith(datetime);
      expect(openWeatherApi.fetchOpenWeatherHourly).toHaveBeenCalledWith(1.29, 103.85);
      expect(govApi.fetchDataGov2Hour).not.toHaveBeenCalled();
    });

    it("should return unified weather forecast", async () => {
      const result = await getWeatherForecast(1.29, 103.85, datetime);

      expect(result).toHaveProperty("temp");
      expect(result).toHaveProperty("feels_like");
      expect(result).toHaveProperty("rain");
      expect(result).toHaveProperty("pop");
      expect(result).toHaveProperty("forecast");
    });

    it("should use region-based forecast from Gov 24h", async () => {
      // Central area
      const result = await getWeatherForecast(1.30, 103.85, datetime);

      expect(result.forecast).toBe("Showers");
    });
  });

  describe("for forecast beyond 24 hours", () => {
    beforeEach(() => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(10);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(25); // More than 24
    });

    it("should throw error when datetime is beyond 24 hours", async () => {
      const datetime = new Date("2024-12-05T10:00:00+08:00");

      await expect(getWeatherForecast(1.29, 103.85, datetime)).rejects.toThrow(
        "Weather data not available for this datetime"
      );

      expect(govApi.fetchDataGov2Hour).not.toHaveBeenCalled();
      expect(govApi.fetchDataGov24Hour).not.toHaveBeenCalled();
      expect(openWeatherApi.fetchOpenWeatherHourly).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(10);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(1);
    });

    it("should propagate API errors from Gov 2-hour endpoint", async () => {
      vi.mocked(govApi.fetchDataGov2Hour).mockRejectedValue(
        new Error("Failed to fetch dataGov2Hour: Service Unavailable")
      );
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockResolvedValue(mockOpenWeatherResponse);

      const datetime = new Date("2024-12-03T11:00:00+08:00");

      await expect(getWeatherForecast(1.29, 103.85, datetime)).rejects.toThrow(
        "Failed to fetch dataGov2Hour"
      );
    });

    it("should propagate API errors from OpenWeather endpoint", async () => {
      vi.mocked(govApi.fetchDataGov2Hour).mockResolvedValue(mockGov2HourResponse);
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockRejectedValue(
        new Error("Failed to fetch openWeatherHourly: Unauthorized")
      );

      const datetime = new Date("2024-12-03T11:00:00+08:00");

      await expect(getWeatherForecast(1.29, 103.85, datetime)).rejects.toThrow(
        "Failed to fetch openWeatherHourly"
      );
    });

    it("should fail fast if any parallel request fails", async () => {
      vi.mocked(govApi.fetchDataGov2Hour).mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return mockGov2HourResponse;
      });
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockRejectedValue(
        new Error("Network error")
      );

      const datetime = new Date("2024-12-03T11:00:00+08:00");

      await expect(getWeatherForecast(1.29, 103.85, datetime)).rejects.toThrow("Network error");
    });
  });

  describe("boundary conditions", () => {
    it("should use 2-hour forecast when exactly 2 hours from now", async () => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(10);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(2);
      vi.mocked(govApi.fetchDataGov2Hour).mockResolvedValue(mockGov2HourResponse);
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockResolvedValue(mockOpenWeatherResponse);

      const datetime = new Date("2024-12-03T12:00:00+08:00");

      await getWeatherForecast(1.29, 103.85, datetime);

      expect(govApi.fetchDataGov2Hour).toHaveBeenCalled();
      expect(govApi.fetchDataGov24Hour).not.toHaveBeenCalled();
    });

    it("should use 24-hour forecast when exactly 24 hours from now", async () => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(10);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(24);
      vi.mocked(govApi.fetchDataGov24Hour).mockResolvedValue(mockGov24HourResponse);
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockResolvedValue(mockOpenWeatherResponse);

      // Use a datetime that will match the 24h response periods
      const datetime = new Date("2024-12-03T06:00:00.000Z"); // Falls in midday-6pm period

      await getWeatherForecast(1.29, 103.85, datetime);

      expect(govApi.fetchDataGov24Hour).toHaveBeenCalled();
      expect(govApi.fetchDataGov2Hour).not.toHaveBeenCalled();
    });

    it("should use 2-hour forecast for current hour (0 hours from now)", async () => {
      vi.mocked(dateTimeUtils.getCurrentHour).mockReturnValue(10);
      vi.mocked(dateTimeUtils.getHoursFromNow).mockReturnValue(0);
      vi.mocked(govApi.fetchDataGov2Hour).mockResolvedValue(mockGov2HourResponse);
      vi.mocked(openWeatherApi.fetchOpenWeatherHourly).mockResolvedValue(mockOpenWeatherResponse);

      const datetime = new Date("2024-12-03T10:00:00+08:00");

      await getWeatherForecast(1.29, 103.85, datetime);

      expect(govApi.fetchDataGov2Hour).toHaveBeenCalled();
      expect(govApi.fetchDataGov24Hour).not.toHaveBeenCalled();
    });
  });
});

