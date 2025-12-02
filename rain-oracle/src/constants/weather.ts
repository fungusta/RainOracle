const NEA_BASE_URL = "https://api-open.data.gov.sg/v2/real-time/api";

export const NEA_ENDPOINTS = {
    TWO_HOUR_FORECAST: `${NEA_BASE_URL}/two-hr-forecast`,
    TWENTY_FOUR_HOUR_FORECAST: `${NEA_BASE_URL}/twenty-four-hr-forecast`,
}

const OPENWEATHER_BASE_URL = "https://pro.openweathermap.org/data/2.5";

export const OPENWEATHER_ENDPOINTS = {
    HOURLY_FORECAST: `${OPENWEATHER_BASE_URL}/forecast/hourly`,
}