export interface Gov24HourResponse {
    code: number;
    errorMsg: string | null;
    data: {
      area_metadata: GovAreaMetadata[];
      records: Gov24HourRecord[];
      paginationToken?: string;
    };
  }
  
  export interface GovAreaMetadata {
    name: string;
    label_location: {
      latitude: number;
      longitude: number;
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
  
  export type GovForecastType =
    | "Fair"
    | "Fair (Day)"
    | "Fair (Night)"
    | "Fair and Warm"
    | "Partly Cloudy"
    | "Partly Cloudy (Day)"
    | "Partly Cloudy (Night)"
    | "Cloudy"
    | "Hazy"
    | "Slightly Hazy"
    | "Windy"
    | "Mist"
    | "Fog"
    | "Light Rain"
    | "Moderate Rain"
    | "Heavy Rain"
    | "Passing Showers"
    | "Light Showers"
    | "Showers"
    | "Heavy Showers"
    | "Thundery Showers"
    | "Heavy Thundery Showers"
    | "Heavy Thundery Showers with Gusty Winds";
  