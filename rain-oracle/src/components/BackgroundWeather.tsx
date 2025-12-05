import { UnifiedWeatherForecast } from "@/types/weather/weatherForecast";
import Rain from "./Rain";
import { getConditionGroup } from "@/types/weather/weatherCondition";
import Lightning from "./Lightning";

interface BackgroundWeatherProps {
    weatherData: UnifiedWeatherForecast | null;
    isDaytime: boolean;
}
export default function BackgroundWeather({ weatherData, isDaytime }: BackgroundWeatherProps) {
    const conditionGroup = weatherData ? getConditionGroup(weatherData.forecast) : "other";
    switch (conditionGroup) {
        case "clear":
            if (isDaytime) {
                return <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100"></div>;
            } else {
                return <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"></div>;
            }
        case "cloudy":
            if (isDaytime) {
                return <div className="fixed inset-0 bg-gray-400"></div>;
            } else {
                return <div className="fixed inset-0 bg-gray-900"></div>;
            }
        case "showers":
            if (isDaytime) {
                return <Rain intensity={0.1} className="bg-gray-400" />;
            } else {
                return <Rain intensity={0.1} className="bg-gray-900" />;
            }
        case "rain":
            if (isDaytime) {
                return <Rain intensity={0.5} className="bg-gray-500" />;
            } else {
                return <Rain intensity={0.5} className="bg-gray-900" />;
            }
        case "thunderstorm":
            return (
                <>
                    {isDaytime ? (
                        <Rain intensity={1} className="bg-gray-600" />
                    ) : (
                        <Rain intensity={1} className="bg-gray-900" />
                    )}
                    <Lightning />
                </>
            );
        case "other":
            if (isDaytime) {
                return <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100"></div>;
            } else {
                return <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"></div>;
            }
    }
}