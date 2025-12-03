import { describe, it, expect } from "vitest";
import { parseGov2HourForecast, parseGov24HourForecast } from "./govParser";
import { Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourResponse } from "@/types/weather/gov24hour";

describe("parseGov2HourForecast", () => {
  const mockResponse: Gov2HourResponse = {
    code: 1,
    errorMsg: null,
    data: {
      area_metadata: [
        {
          name: "Ang Mo Kio",
          label_location: {
            latitude: 1.375,
            longitude: 103.839,
          },
        },
        {
            name: "Bedok",
            label_location: {
                latitude: 1.325,
                longitude: 103.929,
            },
        }
      ],
      items: [
        {
          update_timestamp: "2024-07-17T05:05:54.000Z",
          timestamp: "2024-07-17T04:59:00.000Z",
          valid_period: {
            start: "2024-07-16T16:30:00.000Z",
            end: "2024-07-16T18:30:00.000Z",
            text: "12.30 am to 2.30 am",
          },
          forecasts: [
            {
              area: "Ang Mo Kio",
              forecast: "Fair",
            },
            {
              area: "Bedok",
              forecast: "Fair",
            },
          ],
        },
      ],
      paginationToken: "b2Zmc2V0PTEwMA==",
    },
  };

  it("returns the nearest station and its forecast", () => {
    const result = parseGov2HourForecast(mockResponse, 1.325, 103.9);

    expect(result.nearestStation).toBe("Bedok");
    expect(result.forecast).toBe("Fair");
  });

  it("returns Ang Mo Kio as nearest station from any location", () => {
    const result = parseGov2HourForecast(mockResponse, 1.3, 103.8);

    expect(result.nearestStation).toBe("Ang Mo Kio");
    expect(result.forecast).toBe("Fair");
  });

  it("finds nearest station from full Singapore area list", () => {
    const fullResponse: Gov2HourResponse = {
      code: 0,
      errorMsg: "",
      data: {
        area_metadata: [
          { name: "Ang Mo Kio", label_location: { latitude: 1.375, longitude: 103.839 } },
          { name: "Bedok", label_location: { latitude: 1.321, longitude: 103.924 } },
          { name: "Bishan", label_location: { latitude: 1.350772, longitude: 103.839 } },
          { name: "Boon Lay", label_location: { latitude: 1.304, longitude: 103.701 } },
          { name: "Bukit Batok", label_location: { latitude: 1.353, longitude: 103.754 } },
          { name: "Bukit Merah", label_location: { latitude: 1.277, longitude: 103.819 } },
          { name: "Bukit Panjang", label_location: { latitude: 1.362, longitude: 103.77195 } },
          { name: "Bukit Timah", label_location: { latitude: 1.325, longitude: 103.791 } },
          { name: "Central Water Catchment", label_location: { latitude: 1.38, longitude: 103.805 } },
          { name: "Changi", label_location: { latitude: 1.357, longitude: 103.987 } },
          { name: "Choa Chu Kang", label_location: { latitude: 1.377, longitude: 103.745 } },
          { name: "City", label_location: { latitude: 1.292, longitude: 103.844 } },
          { name: "Clementi", label_location: { latitude: 1.315, longitude: 103.76 } },
          { name: "Geylang", label_location: { latitude: 1.318, longitude: 103.884 } },
          { name: "Hougang", label_location: { latitude: 1.361218, longitude: 103.886 } },
          { name: "Jalan Bahar", label_location: { latitude: 1.347, longitude: 103.67 } },
          { name: "Jurong East", label_location: { latitude: 1.326, longitude: 103.737 } },
          { name: "Jurong Island", label_location: { latitude: 1.266, longitude: 103.699 } },
          { name: "Jurong West", label_location: { latitude: 1.34039, longitude: 103.705 } },
          { name: "Kallang", label_location: { latitude: 1.312, longitude: 103.862 } },
          { name: "Lim Chu Kang", label_location: { latitude: 1.423, longitude: 103.717332 } },
          { name: "Mandai", label_location: { latitude: 1.419, longitude: 103.812 } },
          { name: "Marine Parade", label_location: { latitude: 1.297, longitude: 103.891 } },
          { name: "Novena", label_location: { latitude: 1.327, longitude: 103.826 } },
          { name: "Pasir Ris", label_location: { latitude: 1.37, longitude: 103.948 } },
          { name: "Paya Lebar", label_location: { latitude: 1.358, longitude: 103.914 } },
          { name: "Pioneer", label_location: { latitude: 1.315, longitude: 103.675 } },
          { name: "Pulau Tekong", label_location: { latitude: 1.403, longitude: 104.053 } },
          { name: "Pulau Ubin", label_location: { latitude: 1.404, longitude: 103.96 } },
          { name: "Punggol", label_location: { latitude: 1.401, longitude: 103.904 } },
          { name: "Queenstown", label_location: { latitude: 1.291, longitude: 103.78576 } },
          { name: "Seletar", label_location: { latitude: 1.404, longitude: 103.869 } },
          { name: "Sembawang", label_location: { latitude: 1.445, longitude: 103.818495 } },
          { name: "Sengkang", label_location: { latitude: 1.384, longitude: 103.891443 } },
          { name: "Sentosa", label_location: { latitude: 1.243, longitude: 103.832 } },
          { name: "Serangoon", label_location: { latitude: 1.357, longitude: 103.865 } },
          { name: "Southern Islands", label_location: { latitude: 1.208, longitude: 103.842 } },
          { name: "Sungei Kadut", label_location: { latitude: 1.413, longitude: 103.756 } },
          { name: "Tampines", label_location: { latitude: 1.345, longitude: 103.944 } },
          { name: "Tanglin", label_location: { latitude: 1.308, longitude: 103.813 } },
          { name: "Tengah", label_location: { latitude: 1.374, longitude: 103.715 } },
          { name: "Toa Payoh", label_location: { latitude: 1.334304, longitude: 103.856327 } },
          { name: "Tuas", label_location: { latitude: 1.294947, longitude: 103.635 } },
          { name: "Western Islands", label_location: { latitude: 1.205926, longitude: 103.746 } },
          { name: "Western Water Catchment", label_location: { latitude: 1.405, longitude: 103.689 } },
          { name: "Woodlands", label_location: { latitude: 1.432, longitude: 103.786528 } },
          { name: "Yishun", label_location: { latitude: 1.418, longitude: 103.839 } },
        ],
        items: [
          {
            update_timestamp: "2025-12-03T11:35:32+08:00",
            timestamp: "2025-12-03T11:30:00+08:00",
            valid_period: {
              start: "2025-12-03T11:30:00+08:00",
              end: "2025-12-03T13:30:00+08:00",
              text: "11.30 am to 1.30 pm",
            },
            forecasts: [
              { area: "Ang Mo Kio", forecast: "Partly Cloudy (Day)" },
              { area: "Bedok", forecast: "Partly Cloudy (Day)" },
              { area: "Bishan", forecast: "Partly Cloudy (Day)" },
              { area: "Boon Lay", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Batok", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Merah", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Panjang", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Timah", forecast: "Partly Cloudy (Day)" },
              { area: "Central Water Catchment", forecast: "Partly Cloudy (Day)" },
              { area: "Changi", forecast: "Partly Cloudy (Day)" },
              { area: "Choa Chu Kang", forecast: "Partly Cloudy (Day)" },
              { area: "City", forecast: "Partly Cloudy (Day)" },
              { area: "Clementi", forecast: "Partly Cloudy (Day)" },
              { area: "Geylang", forecast: "Partly Cloudy (Day)" },
              { area: "Hougang", forecast: "Partly Cloudy (Day)" },
              { area: "Jalan Bahar", forecast: "Partly Cloudy (Day)" },
              { area: "Jurong East", forecast: "Partly Cloudy (Day)" },
              { area: "Jurong Island", forecast: "Partly Cloudy (Day)" },
              { area: "Jurong West", forecast: "Partly Cloudy (Day)" },
              { area: "Kallang", forecast: "Partly Cloudy (Day)" },
              { area: "Lim Chu Kang", forecast: "Partly Cloudy (Day)" },
              { area: "Mandai", forecast: "Partly Cloudy (Day)" },
              { area: "Marine Parade", forecast: "Partly Cloudy (Day)" },
              { area: "Novena", forecast: "Partly Cloudy (Day)" },
              { area: "Pasir Ris", forecast: "Partly Cloudy (Day)" },
              { area: "Paya Lebar", forecast: "Partly Cloudy (Day)" },
              { area: "Pioneer", forecast: "Partly Cloudy (Day)" },
              { area: "Pulau Tekong", forecast: "Partly Cloudy (Day)" },
              { area: "Pulau Ubin", forecast: "Partly Cloudy (Day)" },
              { area: "Punggol", forecast: "Partly Cloudy (Day)" },
              { area: "Queenstown", forecast: "Partly Cloudy (Day)" },
              { area: "Seletar", forecast: "Partly Cloudy (Day)" },
              { area: "Sembawang", forecast: "Partly Cloudy (Day)" },
              { area: "Sengkang", forecast: "Partly Cloudy (Day)" },
              { area: "Sentosa", forecast: "Partly Cloudy (Day)" },
              { area: "Serangoon", forecast: "Partly Cloudy (Day)" },
              { area: "Southern Islands", forecast: "Partly Cloudy (Day)" },
              { area: "Sungei Kadut", forecast: "Partly Cloudy (Day)" },
              { area: "Tampines", forecast: "Partly Cloudy (Day)" },
              { area: "Tanglin", forecast: "Partly Cloudy (Day)" },
              { area: "Tengah", forecast: "Partly Cloudy (Day)" },
              { area: "Toa Payoh", forecast: "Partly Cloudy (Day)" },
              { area: "Tuas", forecast: "Partly Cloudy (Day)" },
              { area: "Western Islands", forecast: "Partly Cloudy (Day)" },
              { area: "Western Water Catchment", forecast: "Partly Cloudy (Day)" },
              { area: "Woodlands", forecast: "Partly Cloudy (Day)" },
              { area: "Yishun", forecast: "Partly Cloudy (Day)" },
            ],
          },
        ],
      },
    };

    // User near Tampines (1.345, 103.944)
    const result = parseGov2HourForecast(fullResponse, 1.345, 103.944);
    expect(result.nearestStation).toBe("Tampines");
    expect(result.forecast).toBe("Partly Cloudy (Day)");

    // User near Sentosa (1.243, 103.832)
    const result2 = parseGov2HourForecast(fullResponse, 1.243, 103.832);
    expect(result2.nearestStation).toBe("Sentosa");
    expect(result2.forecast).toBe("Partly Cloudy (Day)");

    // User near Woodlands (1.432, 103.786528)
    const result3 = parseGov2HourForecast(fullResponse, 1.43, 103.79);
    expect(result3.nearestStation).toBe("Woodlands");
    expect(result3.forecast).toBe("Partly Cloudy (Day)");
  });

  it("parses actual API response correctly", () => {
    // Actual response from https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
    // Captured on 2025-12-03T12:05:34+08:00
    const actualApiResponse: Gov2HourResponse = {
      code: 0,
      errorMsg: "",
      data: {
        area_metadata: [
          { name: "Ang Mo Kio", label_location: { latitude: 1.375, longitude: 103.839 } },
          { name: "Bedok", label_location: { latitude: 1.321, longitude: 103.924 } },
          { name: "Bishan", label_location: { latitude: 1.350772, longitude: 103.839 } },
          { name: "Boon Lay", label_location: { latitude: 1.304, longitude: 103.701 } },
          { name: "Bukit Batok", label_location: { latitude: 1.353, longitude: 103.754 } },
          { name: "Bukit Merah", label_location: { latitude: 1.277, longitude: 103.819 } },
          { name: "Bukit Panjang", label_location: { latitude: 1.362, longitude: 103.77195 } },
          { name: "Bukit Timah", label_location: { latitude: 1.325, longitude: 103.791 } },
          { name: "Central Water Catchment", label_location: { latitude: 1.38, longitude: 103.805 } },
          { name: "Changi", label_location: { latitude: 1.357, longitude: 103.987 } },
          { name: "Choa Chu Kang", label_location: { latitude: 1.377, longitude: 103.745 } },
          { name: "City", label_location: { latitude: 1.292, longitude: 103.844 } },
          { name: "Clementi", label_location: { latitude: 1.315, longitude: 103.76 } },
          { name: "Geylang", label_location: { latitude: 1.318, longitude: 103.884 } },
          { name: "Hougang", label_location: { latitude: 1.361218, longitude: 103.886 } },
          { name: "Jalan Bahar", label_location: { latitude: 1.347, longitude: 103.67 } },
          { name: "Jurong East", label_location: { latitude: 1.326, longitude: 103.737 } },
          { name: "Jurong Island", label_location: { latitude: 1.266, longitude: 103.699 } },
          { name: "Jurong West", label_location: { latitude: 1.34039, longitude: 103.705 } },
          { name: "Kallang", label_location: { latitude: 1.312, longitude: 103.862 } },
          { name: "Lim Chu Kang", label_location: { latitude: 1.423, longitude: 103.717332 } },
          { name: "Mandai", label_location: { latitude: 1.419, longitude: 103.812 } },
          { name: "Marine Parade", label_location: { latitude: 1.297, longitude: 103.891 } },
          { name: "Novena", label_location: { latitude: 1.327, longitude: 103.826 } },
          { name: "Pasir Ris", label_location: { latitude: 1.37, longitude: 103.948 } },
          { name: "Paya Lebar", label_location: { latitude: 1.358, longitude: 103.914 } },
          { name: "Pioneer", label_location: { latitude: 1.315, longitude: 103.675 } },
          { name: "Pulau Tekong", label_location: { latitude: 1.403, longitude: 104.053 } },
          { name: "Pulau Ubin", label_location: { latitude: 1.404, longitude: 103.96 } },
          { name: "Punggol", label_location: { latitude: 1.401, longitude: 103.904 } },
          { name: "Queenstown", label_location: { latitude: 1.291, longitude: 103.78576 } },
          { name: "Seletar", label_location: { latitude: 1.404, longitude: 103.869 } },
          { name: "Sembawang", label_location: { latitude: 1.445, longitude: 103.818495 } },
          { name: "Sengkang", label_location: { latitude: 1.384, longitude: 103.891443 } },
          { name: "Sentosa", label_location: { latitude: 1.243, longitude: 103.832 } },
          { name: "Serangoon", label_location: { latitude: 1.357, longitude: 103.865 } },
          { name: "Southern Islands", label_location: { latitude: 1.208, longitude: 103.842 } },
          { name: "Sungei Kadut", label_location: { latitude: 1.413, longitude: 103.756 } },
          { name: "Tampines", label_location: { latitude: 1.345, longitude: 103.944 } },
          { name: "Tanglin", label_location: { latitude: 1.308, longitude: 103.813 } },
          { name: "Tengah", label_location: { latitude: 1.374, longitude: 103.715 } },
          { name: "Toa Payoh", label_location: { latitude: 1.334304, longitude: 103.856327 } },
          { name: "Tuas", label_location: { latitude: 1.294947, longitude: 103.635 } },
          { name: "Western Islands", label_location: { latitude: 1.205926, longitude: 103.746 } },
          { name: "Western Water Catchment", label_location: { latitude: 1.405, longitude: 103.689 } },
          { name: "Woodlands", label_location: { latitude: 1.432, longitude: 103.786528 } },
          { name: "Yishun", label_location: { latitude: 1.418, longitude: 103.839 } },
        ],
        items: [
          {
            update_timestamp: "2025-12-03T12:05:34+08:00",
            timestamp: "2025-12-03T12:00:00+08:00",
            valid_period: {
              start: "2025-12-03T12:00:00+08:00",
              end: "2025-12-03T14:00:00+08:00",
              text: "Midday to 2.00 pm",
            },
            forecasts: [
              { area: "Ang Mo Kio", forecast: "Partly Cloudy (Day)" },
              { area: "Bedok", forecast: "Partly Cloudy (Day)" },
              { area: "Bishan", forecast: "Partly Cloudy (Day)" },
              { area: "Boon Lay", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Batok", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Merah", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Panjang", forecast: "Partly Cloudy (Day)" },
              { area: "Bukit Timah", forecast: "Partly Cloudy (Day)" },
              { area: "Central Water Catchment", forecast: "Partly Cloudy (Day)" },
              { area: "Changi", forecast: "Partly Cloudy (Day)" },
              { area: "Choa Chu Kang", forecast: "Partly Cloudy (Day)" },
              { area: "City", forecast: "Partly Cloudy (Day)" },
              { area: "Clementi", forecast: "Partly Cloudy (Day)" },
              { area: "Geylang", forecast: "Partly Cloudy (Day)" },
              { area: "Hougang", forecast: "Partly Cloudy (Day)" },
              { area: "Jalan Bahar", forecast: "Partly Cloudy (Day)" },
              { area: "Jurong East", forecast: "Partly Cloudy (Day)" },
              { area: "Jurong Island", forecast: "Partly Cloudy (Day)" },
              { area: "Jurong West", forecast: "Partly Cloudy (Day)" },
              { area: "Kallang", forecast: "Partly Cloudy (Day)" },
              { area: "Lim Chu Kang", forecast: "Partly Cloudy (Day)" },
              { area: "Mandai", forecast: "Partly Cloudy (Day)" },
              { area: "Marine Parade", forecast: "Partly Cloudy (Day)" },
              { area: "Novena", forecast: "Partly Cloudy (Day)" },
              { area: "Pasir Ris", forecast: "Partly Cloudy (Day)" },
              { area: "Paya Lebar", forecast: "Partly Cloudy (Day)" },
              { area: "Pioneer", forecast: "Partly Cloudy (Day)" },
              { area: "Pulau Tekong", forecast: "Partly Cloudy (Day)" },
              { area: "Pulau Ubin", forecast: "Partly Cloudy (Day)" },
              { area: "Punggol", forecast: "Partly Cloudy (Day)" },
              { area: "Queenstown", forecast: "Partly Cloudy (Day)" },
              { area: "Seletar", forecast: "Partly Cloudy (Day)" },
              { area: "Sembawang", forecast: "Partly Cloudy (Day)" },
              { area: "Sengkang", forecast: "Partly Cloudy (Day)" },
              { area: "Sentosa", forecast: "Partly Cloudy (Day)" },
              { area: "Serangoon", forecast: "Partly Cloudy (Day)" },
              { area: "Southern Islands", forecast: "Partly Cloudy (Day)" },
              { area: "Sungei Kadut", forecast: "Partly Cloudy (Day)" },
              { area: "Tampines", forecast: "Partly Cloudy (Day)" },
              { area: "Tanglin", forecast: "Partly Cloudy (Day)" },
              { area: "Tengah", forecast: "Partly Cloudy (Day)" },
              { area: "Toa Payoh", forecast: "Partly Cloudy (Day)" },
              { area: "Tuas", forecast: "Partly Cloudy (Day)" },
              { area: "Western Islands", forecast: "Partly Cloudy (Day)" },
              { area: "Western Water Catchment", forecast: "Partly Cloudy (Day)" },
              { area: "Woodlands", forecast: "Partly Cloudy (Day)" },
              { area: "Yishun", forecast: "Partly Cloudy (Day)" },
            ],
          },
        ],
      },
    };

    // Test various locations across Singapore
    // Marina Bay Sands area (1.2834, 103.8607) - should be closest to City
    const marinaBay = parseGov2HourForecast(actualApiResponse, 1.2834, 103.8607);
    expect(marinaBay.nearestStation).toBe("City");
    expect(marinaBay.forecast).toBe("Partly Cloudy (Day)");

    // Changi Airport area (1.3644, 103.9915) - should be closest to Changi
    const changi = parseGov2HourForecast(actualApiResponse, 1.3644, 103.9915);
    expect(changi.nearestStation).toBe("Changi");
    expect(changi.forecast).toBe("Partly Cloudy (Day)");

    // Jurong area (1.3329, 103.7436) - should be closest to Jurong East
    const jurong = parseGov2HourForecast(actualApiResponse, 1.3329, 103.7436);
    expect(jurong.nearestStation).toBe("Jurong East");
    expect(jurong.forecast).toBe("Partly Cloudy (Day)");

    // Orchard Road area (1.3048, 103.8318) - actually closest to City based on distance
    const orchard = parseGov2HourForecast(actualApiResponse, 1.3048, 103.8318);
    expect(orchard.nearestStation).toBe("City");
    expect(orchard.forecast).toBe("Partly Cloudy (Day)");

    // Punggol area (1.4041, 103.9025) - should be closest to Punggol
    const punggol = parseGov2HourForecast(actualApiResponse, 1.4041, 103.9025);
    expect(punggol.nearestStation).toBe("Punggol");
    expect(punggol.forecast).toBe("Partly Cloudy (Day)");
  });
});

describe("parseGov24HourForecast", () => {
  // Full mock data with 4 records (all with date: "2025-12-01")
  const mockResponse: Gov24HourResponse = {
    code: 0,
    errorMsg: "",
    data: {
      records: [
        {
          date: "2025-12-01",
          updatedTimestamp: "2025-12-01T23:10:40+08:00",
          timestamp: "2025-12-01T23:03:00+08:00",
          general: {
            temperature: { low: 25, high: 33, unit: "Degrees Celsius" },
            relativeHumidity: { low: 60, high: 95, unit: "Percentage" },
            forecast: { code: "TL", text: "Thundery Showers" },
            validPeriod: {
              start: "2025-12-02T00:00:00+08:00",
              end: "2025-12-04T00:00:00+08:00",
              text: "0 AM 2 Dec to 0 AM 3 Dec",
            },
            wind: { speed: { low: 5, high: 15 }, direction: "VARIABLE" },
          },
          periods: [
            {
              timePeriod: {
                start: "2025-12-02T00:00:00+08:00",
                end: "2025-12-02T06:00:00+08:00",
                text: "Midnight to 6 am 02 Dec",
              },
              regions: {
                west: { code: "PN", text: "Partly Cloudy (Night)" },
                east: { code: "PN", text: "Partly Cloudy (Night)" },
                central: { code: "PN", text: "Partly Cloudy (Night)" },
                south: { code: "PN", text: "Partly Cloudy (Night)" },
                north: { code: "PN", text: "Partly Cloudy (Night)" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-02T06:00:00+08:00",
                end: "2025-12-02T12:00:00+08:00",
                text: "6 am to Midday 02 Dec",
              },
              regions: {
                west: { code: "TL", text: "Thundery Showers" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "TL", text: "Thundery Showers" },
                south: { code: "TL", text: "Thundery Showers" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-02T12:00:00+08:00",
                end: "2025-12-02T18:00:00+08:00",
                text: "Midday to 6 pm 02 Dec",
              },
              regions: {
                west: { code: "TL", text: "Thundery Showers" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "TL", text: "Thundery Showers" },
                south: { code: "TL", text: "Thundery Showers" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-02T18:00:00+08:00",
                end: "2025-12-03T00:00:00+08:00",
                text: "6 pm to Midnight 02 Dec",
              },
              regions: {
                west: { code: "PN", text: "Partly Cloudy (Night)" },
                east: { code: "PN", text: "Partly Cloudy (Night)" },
                central: { code: "PN", text: "Partly Cloudy (Night)" },
                south: { code: "PN", text: "Partly Cloudy (Night)" },
                north: { code: "PN", text: "Partly Cloudy (Night)" },
              },
            },
          ],
        },
        {
          date: "2025-12-01",
          updatedTimestamp: "2025-12-01T17:40:56+08:00",
          timestamp: "2025-12-01T17:33:00+08:00",
          general: {
            temperature: { low: 25, high: 33, unit: "Degrees Celsius" },
            relativeHumidity: { low: 60, high: 95, unit: "Percentage" },
            forecast: { code: "TL", text: "Thundery Showers" },
            validPeriod: {
              start: "2025-12-01T18:00:00+08:00",
              end: "2025-12-02T18:00:00+08:00",
              text: "6 PM 1 Dec to 6 PM 2 Dec",
            },
            wind: { speed: { low: 5, high: 15 }, direction: "VARIABLE" },
          },
          periods: [
            {
              timePeriod: {
                start: "2025-12-01T18:00:00+08:00",
                end: "2025-12-02T06:00:00+08:00",
                text: "6 pm 01 Dec to 6 am 02 Dec",
              },
              regions: {
                west: { code: "PN", text: "Partly Cloudy (Night)" },
                east: { code: "PN", text: "Partly Cloudy (Night)" },
                central: { code: "PN", text: "Partly Cloudy (Night)" },
                south: { code: "PN", text: "Partly Cloudy (Night)" },
                north: { code: "PN", text: "Partly Cloudy (Night)" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-02T06:00:00+08:00",
                end: "2025-12-02T12:00:00+08:00",
                text: "6 am to Midday 02 Dec",
              },
              regions: {
                west: { code: "TL", text: "Thundery Showers" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "TL", text: "Thundery Showers" },
                south: { code: "TL", text: "Thundery Showers" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-02T12:00:00+08:00",
                end: "2025-12-02T18:00:00+08:00",
                text: "Midday to 6 pm 02 Dec",
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
        {
          date: "2025-12-01",
          updatedTimestamp: "2025-12-01T11:40:58+08:00",
          timestamp: "2025-12-01T11:30:00+08:00",
          general: {
            temperature: { low: 25, high: 33, unit: "Degrees Celsius" },
            relativeHumidity: { low: 60, high: 95, unit: "Percentage" },
            forecast: { code: "TL", text: "Thundery Showers" },
            validPeriod: {
              start: "2025-12-01T12:00:00+08:00",
              end: "2025-12-02T12:00:00+08:00",
              text: "12 PM 1 Dec to 12 PM 2 Dec",
            },
            wind: { speed: { low: 10, high: 15 }, direction: "WSW" },
          },
          periods: [
            {
              timePeriod: {
                start: "2025-12-01T12:00:00+08:00",
                end: "2025-12-01T18:00:00+08:00",
                text: "Midday to 6 pm 01 Dec",
              },
              regions: {
                west: { code: "SH", text: "Showers" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "TL", text: "Thundery Showers" },
                south: { code: "PC", text: "Partly Cloudy (Day)" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-01T18:00:00+08:00",
                end: "2025-12-02T06:00:00+08:00",
                text: "6 pm 01 Dec to 6 am 02 Dec",
              },
              regions: {
                west: { code: "PN", text: "Partly Cloudy (Night)" },
                east: { code: "PN", text: "Partly Cloudy (Night)" },
                central: { code: "PN", text: "Partly Cloudy (Night)" },
                south: { code: "PN", text: "Partly Cloudy (Night)" },
                north: { code: "PN", text: "Partly Cloudy (Night)" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-02T06:00:00+08:00",
                end: "2025-12-02T12:00:00+08:00",
                text: "6 am to Midday 02 Dec",
              },
              regions: {
                west: { code: "PC", text: "Partly Cloudy (Day)" },
                east: { code: "PC", text: "Partly Cloudy (Day)" },
                central: { code: "PC", text: "Partly Cloudy (Day)" },
                south: { code: "PC", text: "Partly Cloudy (Day)" },
                north: { code: "PC", text: "Partly Cloudy (Day)" },
              },
            },
          ],
        },
        {
          date: "2025-12-01",
          updatedTimestamp: "2025-12-01T05:40:43+08:00",
          timestamp: "2025-12-01T05:30:00+08:00",
          general: {
            temperature: { low: 25, high: 33, unit: "Degrees Celsius" },
            relativeHumidity: { low: 60, high: 95, unit: "Percentage" },
            forecast: { code: "TL", text: "Thundery Showers" },
            validPeriod: {
              start: "2025-12-01T06:00:00+08:00",
              end: "2025-12-02T06:00:00+08:00",
              text: "6 AM 1 Dec to 6 AM 2 Dec",
            },
            wind: { speed: { low: 10, high: 15 }, direction: "WSW" },
          },
          periods: [
            {
              timePeriod: {
                start: "2025-12-01T06:00:00+08:00",
                end: "2025-12-01T12:00:00+08:00",
                text: "6 am to Midday 01 Dec",
              },
              regions: {
                west: { code: "PC", text: "Partly Cloudy (Day)" },
                east: { code: "PC", text: "Partly Cloudy (Day)" },
                central: { code: "PC", text: "Partly Cloudy (Day)" },
                south: { code: "PC", text: "Partly Cloudy (Day)" },
                north: { code: "PC", text: "Partly Cloudy (Day)" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-01T12:00:00+08:00",
                end: "2025-12-01T18:00:00+08:00",
                text: "Midday to 6 pm 01 Dec",
              },
              regions: {
                west: { code: "PC", text: "Partly Cloudy (Day)" },
                east: { code: "TL", text: "Thundery Showers" },
                central: { code: "TL", text: "Thundery Showers" },
                south: { code: "PC", text: "Partly Cloudy (Day)" },
                north: { code: "TL", text: "Thundery Showers" },
              },
            },
            {
              timePeriod: {
                start: "2025-12-01T18:00:00+08:00",
                end: "2025-12-02T06:00:00+08:00",
                text: "6 pm 01 Dec to 6 am 02 Dec",
              },
              regions: {
                west: { code: "PN", text: "Partly Cloudy (Night)" },
                east: { code: "PN", text: "Partly Cloudy (Night)" },
                central: { code: "PN", text: "Partly Cloudy (Night)" },
                south: { code: "PN", text: "Partly Cloudy (Night)" },
                north: { code: "PN", text: "Partly Cloudy (Night)" },
              },
            },
          ],
        },
      ],
    },
  };

  // Period 0 of record 0: 2025-12-02T00:00:00+08:00 to 2025-12-02T06:00:00+08:00
  // In UTC: 2025-12-01T16:00:00Z to 2025-12-01T22:00:00Z
  // datetime.toISOString().split('T')[0] = "2025-12-01" matches record.date
  const datetimePeriod0 = new Date("2025-12-01T18:00:00.000Z"); // 2am SGT Dec 2

  // Period 1 of record 0: 2025-12-02T06:00:00+08:00 to 2025-12-02T12:00:00+08:00
  // In UTC: 2025-12-01T22:00:00Z to 2025-12-02T04:00:00Z
  // Use 2025-12-01T23:00:00Z so UTC date is still "2025-12-01"
  const datetimePeriod1 = new Date("2025-12-01T23:00:00.000Z"); // 7am SGT Dec 2

  describe("matching record by date and period by time", () => {
    it("returns forecast from period 0 (midnight-6am) for all regions", () => {
      // Central Singapore
      const result = parseGov24HourForecast(mockResponse, 1.30, 103.85, datetimePeriod0);
      expect(result.nearestStation).toBe("central");
      expect(result.forecast).toBe("Partly Cloudy (Night)");
    });

    it("returns forecast from period 1 (6am-midday) for all regions", () => {
      // Central Singapore - different forecast in period 1
      const result = parseGov24HourForecast(mockResponse, 1.30, 103.85, datetimePeriod1);
      expect(result.nearestStation).toBe("central");
      expect(result.forecast).toBe("Thundery Showers");
    });

    it("returns West region forecast for western coordinates", () => {
      // Jurong area - west Singapore (lon <= 103.75)
      const result = parseGov24HourForecast(mockResponse, 1.33, 103.7, datetimePeriod0);
      expect(result.nearestStation).toBe("west");
      expect(result.forecast).toBe("Partly Cloudy (Night)");
    });

    it("returns East region forecast for eastern coordinates", () => {
      // Tampines/Changi area - east Singapore (lon >= 103.9)
      const result = parseGov24HourForecast(mockResponse, 1.35, 103.95, datetimePeriod0);
      expect(result.nearestStation).toBe("east");
      expect(result.forecast).toBe("Partly Cloudy (Night)");
    });

    it("returns South region forecast for southern coordinates", () => {
      // Sentosa area - south Singapore (lat <= 1.27)
      const result = parseGov24HourForecast(mockResponse, 1.25, 103.83, datetimePeriod0);
      expect(result.nearestStation).toBe("south");
      expect(result.forecast).toBe("Partly Cloudy (Night)");
    });

    it("returns North region forecast for northern coordinates", () => {
      // Woodlands/Sembawang area - north Singapore (lat >= 1.38)
      const result = parseGov24HourForecast(mockResponse, 1.43, 103.82, datetimePeriod0);
      expect(result.nearestStation).toBe("north");
      expect(result.forecast).toBe("Partly Cloudy (Night)");
    });
  });

  describe("error handling", () => {
    it("throws error when no record matches the date", () => {
      // UTC date "2025-12-03" won't match any record with date "2025-12-01"
      const datetimeNoMatch = new Date("2025-12-03T00:00:00.000Z");
      
      expect(() => parseGov24HourForecast(mockResponse, 1.30, 103.85, datetimeNoMatch))
        .toThrow("No record found for the given datetime");
    });

    it("throws error when datetime falls outside all periods in matched record", () => {
      // UTC date "2025-12-01" matches record, but time 10:00:00Z (6pm SGT) 
      // is outside period 0 (16:00-22:00Z) but before period 1 starts (22:00Z)
      // Actually this falls in period 0 range... let me use a time that's definitely outside
      // Period 0: 16:00-22:00Z, Period 1: 22:00-04:00Z (next day)
      // Use 12:00Z which is before period 0 starts
      const datetimeNoPeriod = new Date("2025-12-01T12:00:00.000Z"); // 8pm SGT Dec 1, before midnight
      
      expect(() => parseGov24HourForecast(mockResponse, 1.30, 103.85, datetimeNoPeriod))
        .toThrow("No period found for the given datetime");
    });
  });

  describe("actual API response", () => {
    // Actual response from https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast
    // Captured on 2025-12-03T11:50:47+08:00
    const actualApiResponse: Gov24HourResponse = {
      code: 0,
      errorMsg: "",
      data: {
        records: [
          {
            date: "2025-12-03",
            updatedTimestamp: "2025-12-03T11:50:47+08:00",
            timestamp: "2025-12-03T11:46:00+08:00",
            general: {
              temperature: { low: 24, high: 34, unit: "Degrees Celsius" },
              relativeHumidity: { low: 60, high: 95, unit: "Percentage" },
              forecast: { code: "TL", text: "Thundery Showers" },
              validPeriod: {
                start: "2025-12-03T12:00:00+08:00",
                end: "2025-12-04T12:00:00+08:00",
                text: "12 PM 3 Dec to 12 PM 4 Dec",
              },
              wind: { speed: { low: 5, high: 15 }, direction: "WNW" },
            },
            periods: [
              {
                timePeriod: {
                  start: "2025-12-03T12:00:00+08:00",
                  end: "2025-12-03T18:00:00+08:00",
                  text: "Midday to 6 pm 03 Dec",
                },
                regions: {
                  west: { code: "TL", text: "Thundery Showers" },
                  east: { code: "TL", text: "Thundery Showers" },
                  central: { code: "TL", text: "Thundery Showers" },
                  south: { code: "TL", text: "Thundery Showers" },
                  north: { code: "TL", text: "Thundery Showers" },
                },
              },
              {
                timePeriod: {
                  start: "2025-12-03T18:00:00+08:00",
                  end: "2025-12-04T06:00:00+08:00",
                  text: "6 pm 03 Dec to 6 am 04 Dec",
                },
                regions: {
                  west: { code: "TL", text: "Thundery Showers" },
                  east: { code: "TL", text: "Thundery Showers" },
                  central: { code: "TL", text: "Thundery Showers" },
                  south: { code: "TL", text: "Thundery Showers" },
                  north: { code: "TL", text: "Thundery Showers" },
                },
              },
              {
                timePeriod: {
                  start: "2025-12-04T06:00:00+08:00",
                  end: "2025-12-04T12:00:00+08:00",
                  text: "6 am to Midday 04 Dec",
                },
                regions: {
                  west: { code: "PC", text: "Partly Cloudy (Day)" },
                  east: { code: "PC", text: "Partly Cloudy (Day)" },
                  central: { code: "PC", text: "Partly Cloudy (Day)" },
                  south: { code: "PC", text: "Partly Cloudy (Day)" },
                  north: { code: "PC", text: "Partly Cloudy (Day)" },
                },
              },
            ],
          },
        ],
      },
    };

    // Period 0: 2025-12-03T12:00:00+08:00 to 2025-12-03T18:00:00+08:00
    // In UTC: 2025-12-03T04:00:00Z to 2025-12-03T10:00:00Z
    const datetimePeriod0 = new Date("2025-12-03T05:00:00.000Z"); // 1pm SGT Dec 3

    // Period 1: 2025-12-03T18:00:00+08:00 to 2025-12-04T06:00:00+08:00
    // In UTC: 2025-12-03T10:00:00Z to 2025-12-03T22:00:00Z
    const datetimePeriod1 = new Date("2025-12-03T12:00:00.000Z"); // 8pm SGT Dec 3

    // Period 2: 2025-12-04T06:00:00+08:00 to 2025-12-04T12:00:00+08:00
    // In UTC: 2025-12-03T22:00:00Z to 2025-12-04T04:00:00Z
    const datetimePeriod2 = new Date("2025-12-03T23:00:00.000Z"); // 7am SGT Dec 4

    it("parses period 0 (midday-6pm) correctly for all regions", () => {
      // West - Jurong area
      const west = parseGov24HourForecast(actualApiResponse, 1.33, 103.7, datetimePeriod0);
      expect(west.nearestStation).toBe("west");
      expect(west.forecast).toBe("Thundery Showers");

      // East - Changi area
      const east = parseGov24HourForecast(actualApiResponse, 1.35, 103.95, datetimePeriod0);
      expect(east.nearestStation).toBe("east");
      expect(east.forecast).toBe("Thundery Showers");

      // Central - City area
      const central = parseGov24HourForecast(actualApiResponse, 1.30, 103.85, datetimePeriod0);
      expect(central.nearestStation).toBe("central");
      expect(central.forecast).toBe("Thundery Showers");

      // South - Sentosa area
      const south = parseGov24HourForecast(actualApiResponse, 1.25, 103.83, datetimePeriod0);
      expect(south.nearestStation).toBe("south");
      expect(south.forecast).toBe("Thundery Showers");

      // North - Woodlands area
      const north = parseGov24HourForecast(actualApiResponse, 1.43, 103.82, datetimePeriod0);
      expect(north.nearestStation).toBe("north");
      expect(north.forecast).toBe("Thundery Showers");
    });

    it("parses period 1 (6pm-6am overnight) correctly", () => {
      const result = parseGov24HourForecast(actualApiResponse, 1.30, 103.85, datetimePeriod1);
      expect(result.nearestStation).toBe("central");
      expect(result.forecast).toBe("Thundery Showers");
    });

    it("parses period 2 (6am-midday next day) with different forecast", () => {
      const result = parseGov24HourForecast(actualApiResponse, 1.30, 103.85, datetimePeriod2);
      expect(result.nearestStation).toBe("central");
      expect(result.forecast).toBe("Partly Cloudy (Day)");
    });

    it("correctly identifies regions based on coordinates", () => {
      // Marina Bay Sands (1.2834, 103.8607) - Central area (lat between 1.27-1.38, lon between 103.75-103.9)
      const marinaBay = parseGov24HourForecast(actualApiResponse, 1.2834, 103.8607, datetimePeriod0);
      expect(marinaBay.nearestStation).toBe("central");

      // Changi Airport (1.3644, 103.9915) - East area (lon >= 103.9)
      const changi = parseGov24HourForecast(actualApiResponse, 1.3644, 103.9915, datetimePeriod0);
      expect(changi.nearestStation).toBe("east");

      // Tuas (1.2949, 103.635) - West area (lon <= 103.75)
      const tuas = parseGov24HourForecast(actualApiResponse, 1.2949, 103.635, datetimePeriod0);
      expect(tuas.nearestStation).toBe("west");

      // Sembawang (1.445, 103.82) - North area (lat >= 1.38)
      const sembawang = parseGov24HourForecast(actualApiResponse, 1.445, 103.82, datetimePeriod0);
      expect(sembawang.nearestStation).toBe("north");

      // Sentosa (1.243, 103.832) - South area (lat <= 1.27)
      const sentosa = parseGov24HourForecast(actualApiResponse, 1.243, 103.832, datetimePeriod0);
      expect(sentosa.nearestStation).toBe("south");
    });
  });
});
