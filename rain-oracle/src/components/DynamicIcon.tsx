import { cn } from "@/lib/utils";
import { Cloud, Sun, CloudRain, CloudLightning, Moon, CloudSun, CloudMoon  } from "lucide-react";
import { WeatherConditionGroup } from "@/types/weather/weatherCondition";

export type DynamicIconProps = {
    icon: "sun" | "cloud" | "rain" | "thunderstorm" | "day" | "night" | "day-cloud" | "night-cloud" | WeatherConditionGroup;
    className?: string;
    isDaytime?: boolean;
}



export default function DynamicIcon({ icon, className, isDaytime }: DynamicIconProps) {   
    switch (icon) {
        case "clear":
            if (isDaytime) {
                return <Sun className={cn("w-12 h-12 text-yellow-400", className)} />;
            } else {
                return <Moon className={cn("w-12 h-12 text-gray-400", className)} />;
            }
        case "cloud":
        case "cloudy":
            if (isDaytime) {
                return <CloudSun className={cn("w-12 h-12 text-gray-400", className)} />;
            } else {
                return <CloudMoon className={cn("w-12 h-12 text-gray-400", className)} />;
            }
        case "rain":
        case "drizzle":
        case "showers":
            return <CloudRain className={cn("w-12 h-12 text-blue-400", className)} />;
        case "thunderstorm":
            return <CloudLightning className={cn("w-12 h-12 text-gray-600", className)} />;
        case "day":
            return <Sun className={cn("w-12 h-12 text-yellow-400", className)} />;
        case "sun":
            return <Sun className={cn("w-12 h-12 text-yellow-400", className)} />;
        case "night":
            return <Moon color="white" className={cn("w-12 h-12 text-white", className)} />;
        case "day-cloud":
            return <CloudSun color="white" className={cn("w-12 h-12 text-gray-400", className)} />;
        case "night-cloud":
            return <CloudMoon color="white" className={cn("w-12 h-12 text-gray-400", className)} />;
    }
}