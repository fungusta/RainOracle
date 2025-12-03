import { ENV } from "@/constants/env";
import { NEA_ENDPOINTS } from "@/constants/weather";
import { Gov2HourResponse } from "@/types/weather/gov2hour";
import { Gov24HourResponse } from "@/types/weather/gov24hour";
import { formatDateTime } from "@/utils/dateTimeUtils";

export async function fetchDataGov2Hour(datetime: Date): Promise<Gov2HourResponse> { 
    console.log(`${NEA_ENDPOINTS.TWO_HOUR_FORECAST}?date=${formatDateTime(datetime)}`);
    const response = await fetch(`${NEA_ENDPOINTS.TWO_HOUR_FORECAST}?date=${formatDateTime(datetime)}`, {
        headers: {
            "x-api-key": ENV.SG_WEATHER_API_KEY
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch dataGov2Hour: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  
  
  export async function fetchDataGov24Hour(datetime: Date): Promise<Gov24HourResponse> { 
      console.log(`${NEA_ENDPOINTS.TWENTY_FOUR_HOUR_FORECAST}?date=${formatDateTime(datetime)}`);
      const response = await fetch(`${NEA_ENDPOINTS.TWENTY_FOUR_HOUR_FORECAST}?date=${formatDateTime(datetime)}`, {
          headers: {
              "x-api-key": ENV.SG_WEATHER_API_KEY
          }
      });
      if (!response.ok) {
          throw new Error(`Failed to fetch dataGov24Hour: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
  }