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
