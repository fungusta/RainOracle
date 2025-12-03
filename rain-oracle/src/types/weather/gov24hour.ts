import { AreaMetadata, GovForecastType } from "./gov";

export type SingaporeRegion = "north" | "south" | "east" | "west" | "central";

export interface Gov24HourResponse {
    code: number;
    errorMsg: string | null;
    data: {
      area_metadata?: AreaMetadata[];
      records: Gov24HourRecord[];
      paginationToken?: string;
    };
  }
  
  export interface Gov24HourRecord {
    date: string;
    updatedTimestamp: string;
    timestamp: string;
    general: {
      validPeriod: {
        start: string;
        end: string;
        text: string;
      };
      temperature: {
        low: number;
        high: number;
        unit: string; // "Degrees Celsius"
      };
      relativeHumidity: {
        low: number;
        high: number;
        unit: string; // "Percentage"
      };
      forecast: {
        code: string;
        text: GovForecastType;
      };
      wind: {
        speed: {
          low: number;
          high: number;
        };
        direction: string;
      };
    };
  
    periods: Gov24HourPeriod[];
  }
  
  export interface Gov24HourPeriod {
    timePeriod: {
      start: string;
      end: string;
      text: string;
    };
    regions: {
      west: GovRegionForecast;
      east: GovRegionForecast;
      central: GovRegionForecast;
      north: GovRegionForecast;
      south: GovRegionForecast;
    };
  }
  
  export interface GovRegionForecast {
    code: string;
    text: GovForecastType;
  }

  export interface Gov24HourForecast {
    nearestStation: string;
    forecast: GovForecastType;
  }