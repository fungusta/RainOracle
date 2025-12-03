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
  | "Heavy Thundery Showers with Gusty Winds"
  | "thunderstorm with light rain";

export interface AreaMetadata {
    name: string;
    label_location: {
      latitude: number;
      longitude: number;
    };
  }
