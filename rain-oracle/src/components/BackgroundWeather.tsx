import { UnifiedWeatherForecast } from "@/types/weather/weatherForecast";
import Rain from "./Rain";
import { getConditionGroup } from "@/types/weather/weatherCondition";
import Lightning from "./Lightning";

interface BackgroundWeatherProps {
    weatherData: UnifiedWeatherForecast | null;
}
export default function BackgroundWeather({ weatherData }: BackgroundWeatherProps) {
    const conditionGroup = weatherData ? getConditionGroup(weatherData.forecast) : "other";
    switch (conditionGroup) {
        case "clear":
            return <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100"></div>;
        case "cloudy":
            return <div className="fixed inset-0 bg-gray-400"></div>;
        case "showers":
            return <Rain intensity={0.1} className="bg-gray-400" />;
        case "rain":
            return <Rain intensity={0.7} className="bg-gray-500" />;
        case "thunderstorm":
            return (
                <>
                    <Rain intensity={1} className="bg-gray-600" />
                    <Lightning />
                </>
            );
        case "other":
            return <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100"></div>;
    }
}