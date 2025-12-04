import { GovForecastType } from "./gov";
import { OpenWeatherCondition } from "./openweatherHourly";

// Unified weather condition groups
export type WeatherConditionGroup =
  | "clear"
  | "cloudy"
  | "haze"
  | "drizzle"
  | "rain"
  | "showers"
  | "thunderstorm"
  | "other";

// All possible weather conditions from both sources
export type WeatherCondition = GovForecastType | OpenWeatherCondition;

// Mapping of conditions to their groups
const conditionGroupMap: Record<string, WeatherConditionGroup> = {
  // Clear conditions
  "Fair": "clear",
  "Fair (Day)": "clear",
  "Fair (Night)": "clear",
  "Fair and Warm": "clear",
  "clear sky": "clear",

  // Cloudy conditions
  "Partly Cloudy": "cloudy",
  "Partly Cloudy (Day)": "cloudy",
  "Partly Cloudy (Night)": "cloudy",
  "Cloudy": "cloudy",
  "few clouds: 11-25%": "cloudy",
  "scattered clouds: 25-50%": "cloudy",
  "broken clouds: 51-84%": "cloudy",
  "overcast clouds: 85-100%": "cloudy",

  // Haze/Fog/Mist conditions
  "Hazy": "haze",
  "Slightly Hazy": "haze",
  "Mist": "haze",
  "Fog": "haze",

  // Drizzle conditions
  "light intensity drizzle": "drizzle",
  "drizzle": "drizzle",
  "heavy intensity drizzle": "drizzle",
  "light intensity drizzle rain": "drizzle",
  "drizzle rain": "drizzle",
  "heavy intensity drizzle rain": "drizzle",
  "shower drizzle": "drizzle",

  // Rain conditions (non-shower, non-thunderstorm)
  "Light Rain": "rain",
  "Moderate Rain": "rain",
  "Heavy Rain": "rain",
  "light rain": "rain",
  "moderate rain": "rain",
  "heavy intensity rain": "rain",
  "very heavy rain": "rain",
  "extreme rain": "rain",
  "freezing rain": "rain",

  // Shower conditions
  "Passing Showers": "showers",
  "Light Showers": "showers",
  "Showers": "showers",
  "Heavy Showers": "showers",
  "light intensity shower rain": "showers",
  "shower rain": "showers",
  "heavy intensity shower rain": "showers",
  "ragged shower rain": "showers",
  "shower rain and drizzle": "showers",
  "heavy shower rain and drizzle": "showers",

  // Thunderstorm conditions
  "Thundery Showers": "thunderstorm",
  "Heavy Thundery Showers": "thunderstorm",
  "Heavy Thundery Showers with Gusty Winds": "thunderstorm",
  "thunderstorm with light rain": "thunderstorm",
  "thunderstorm with rain": "thunderstorm",
  "thunderstorm with heavy rain": "thunderstorm",
  "light thunderstorm": "thunderstorm",
  "thunderstorm": "thunderstorm",
  "heavy thunderstorm": "thunderstorm",
  "ragged thunderstorm": "thunderstorm",
  "thunderstorm with light drizzle": "thunderstorm",
  "thunderstorm with drizzle": "thunderstorm",
  "thunderstorm with heavy drizzle": "thunderstorm",

  // Other conditions
  "Windy": "other",
};

/**
 * Get the weather condition group for a given condition
 */
export function getConditionGroup(condition: WeatherCondition | string): WeatherConditionGroup {
  return conditionGroupMap[condition] ?? "other";
}

/**
 * Check if a condition belongs to a specific group
 */
export function isConditionInGroup(
  condition: WeatherCondition | string,
  group: WeatherConditionGroup
): boolean {
  return getConditionGroup(condition) === group;
}

/**
 * Get all conditions that belong to a specific group
 */
export function getConditionsInGroup(group: WeatherConditionGroup): string[] {
  return Object.entries(conditionGroupMap)
    .filter(([_, g]) => g === group)
    .map(([condition]) => condition);
}

/**
 * Check if the condition indicates precipitation (rain, showers, drizzle, or thunderstorm)
 */
export function hasPrecipitation(condition: WeatherCondition | string): boolean {
  const group = getConditionGroup(condition);
  return ["rain", "showers", "drizzle", "thunderstorm"].includes(group);
}

/**
 * Get a human-readable label for a condition group
 */
export function getGroupLabel(group: WeatherConditionGroup): string {
  const labels: Record<WeatherConditionGroup, string> = {
    clear: "Clear",
    cloudy: "Cloudy",
    haze: "Haze/Fog",
    drizzle: "Drizzle",
    rain: "Rain",
    showers: "Showers",
    thunderstorm: "Thunderstorm",
    other: "Other",
  };
  return labels[group];
}

