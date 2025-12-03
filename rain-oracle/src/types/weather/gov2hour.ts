import { AreaMetadata, GovForecastType } from "./gov";

export interface Gov2HourResponse {
    code: number;
    errorMsg: string | null;
    data: {
      area_metadata: AreaMetadata[];
      items: TwoHourForecastItem[];
      paginationToken?: string;
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
    forecast: GovForecastType;
  }

    export interface Gov2HourForecast {
    nearestStation: string;
    forecast: GovForecastType;
  }