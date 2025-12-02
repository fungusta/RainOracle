export interface Gov2HourResponse {
    code: number;
    errorMsg: string | null;
    data: {
      area_metadata: AreaMetadata[];
      items: TwoHourForecastItem[];
      paginationToken?: string;
    };
  }
  
  export interface AreaMetadata {
    name: string;
    label_location: {
      latitude: number;
      longitude: number;
    };
  }
  
  export interface TwoHourForecastItem {
    update_timestamp: string;
    timestamp: string;
    valid_period: {
      start: string;
      end: string;
      text: string;
    };
    forecasts: AreaForecast[];
  }
  
  export interface AreaForecast {
    area: string;
    forecast: TwoHourForecastType;
  }
  
  export type TwoHourForecastType =
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
  