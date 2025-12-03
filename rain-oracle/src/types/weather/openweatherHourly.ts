export interface OpenWeatherHourlyResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherForecastItem[];
  city: OpenWeatherCity;
}

export interface OpenWeatherHourlyForecast {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  rain: number;
  pop: number;
  condition: string;
  description: string;
}

export interface OpenWeatherForecastItem {
  dt: number;
  dt_txt: string;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level?: number;
    grnd_level?: number;
    humidity: number;
    temp_kf?: number;
  };

  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  clouds: {
    all: number;
  };

  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };

  visibility: number;

  rain: {
    "1h": number;
  };

  snow?: {
    "1h"?: number;
  };

  pop: number; // probability of precipitation

  sys: {
    pod: "d" | "n";
  };
}

export interface OpenWeatherCity {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export type OpenWeatherCondition = 
  "thunderstorm with light rain"
|  "thunderstorm with rain"
|  "thunderstorm with heavy rain"
|  "light thunderstorm"
|  "thunderstorm"
|  "heavy thunderstorm"
|  "ragged thunderstorm"
|  "thunderstorm with light drizzle"
|  "thunderstorm with drizzle"
|  "thunderstorm with heavy drizzle"
|  "light intensity drizzle"
|  "drizzle"
|  "heavy intensity drizzle"
|  "light intensity drizzle rain"
|  "drizzle rain"
|  "heavy intensity drizzle rain"
|  "shower rain and drizzle"
|  "heavy shower rain and drizzle"
|  "shower drizzle"
|  "light rain"
|  "moderate rain"
|  "heavy intensity rain"
|  "very heavy rain"
|  "extreme rain"
|  "freezing rain"
|  "light intensity shower rain"
|  "shower rain"
|  "heavy intensity shower rain"
|  "ragged shower rain"
|  "clear sky"
|  "few clouds: 11-25%"
|  "scattered clouds: 25-50%"
|  "broken clouds: 51-84%"
|  "overcast clouds: 85-100%"
