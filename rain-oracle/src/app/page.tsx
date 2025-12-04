'use client';

import { useState, useRef, useEffect } from "react";
import { Sun, CloudRain, Check, ChevronsUpDown } from "lucide-react";
import { getTimeString, isTomorrow, getHoursFromNow, getCurrentHour, hourToDateTime } from "@/utils/dateTimeUtils";
import { UnifiedWeatherForecast } from "@/types/weather/weatherForecast";
import { getCoordinatesFromLocation, getLocationsByArea, LocationName } from "@/utils/location";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BackgroundWeather from "@/components/BackgroundWeather";

const locationsByArea = getLocationsByArea();

export default function App() {
  const [showWeather, setShowWeather] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<LocationName>();
  const [selectedHour, setSelectedHour] = useState(getCurrentHour()); // Default to noon, will be set on client
  const [isDragging, setIsDragging] = useState(false);
  const [weatherData, setWeatherData] = useState<UnifiedWeatherForecast | null>(null);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  const currentHour = getCurrentHour();

  const handleLocationChange = (locationName: string) => {
    setSelectedLocationName(locationName as LocationName);
    const coords = getCoordinatesFromLocation(locationName);
    setLocation(coords);
  };

  const fetchWeatherData = async (): Promise<UnifiedWeatherForecast> => {
    if (!location) {
      throw new Error("Location not set");
    }

    const datetime = hourToDateTime(selectedHour);
    const response = await fetch(
      `/api/weather?latitude=${location.lat}&longitude=${location.lon}&datetime=${datetime.toISOString()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    return response.json();
  };

  const handleCheckWeather = async () => {
    if (!location) return; // Don't proceed if location is empty

    setIsLoading(true);

    try {
      const response = await fetchWeatherData();
      setWeatherData(response);
      setShowWeather(true);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate hour from mouse position (0-23, where 0 = 12am at top)
  const calculateHourFromPosition = (
    clientX: number,
    clientY: number,
  ) => {
    if (!circleRef.current) return 0;

    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Calculate angle in radians, adjusted so 0 degrees is at top (12am)
    let angle = Math.atan2(deltaX, -deltaY);
    if (angle < 0) angle += 2 * Math.PI;

    // Convert to hour of day (0-23)
    const hour = Math.round((angle / (2 * Math.PI)) * 24) % 24;
    return hour;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!circleRef.current) return;

    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Button radius is 88px (w-44 h-44 = 176px / 2 = 88px)
    // Only handle clicks outside the button area (on the ring)
    if (distanceFromCenter > 88) {
      e.stopPropagation();
      setIsDragging(true);
      const hour = calculateHourFromPosition(
        e.clientX,
        e.clientY,
      );
      setSelectedHour(hour);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const hour = calculateHourFromPosition(
      e.clientX,
      e.clientY,
    );
    setSelectedHour(hour);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove,
        );
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <BackgroundWeather weatherData={weatherData} />
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        {!showWeather ? (
          /* Initial State - Button with Inputs */
          <div className="flex flex-col items-center gap-6">
            {/* Location Input */}
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-[280px] justify-between glass text-gray-700 shadow-lg transition-all duration-300"
                >
                  {selectedLocationName ?? "Select a location..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0 glass shadow-2xl">
                <Command className="bg-transparent">
                  <CommandInput placeholder="Search location..." className="border-b border-white/30" />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty className="text-gray-600">No location found.</CommandEmpty>
                    <CommandGroup heading="Central" className="[&_[cmdk-group-heading]]:text-sky-700 [&_[cmdk-group-heading]]:font-semibold">
                      {locationsByArea.central.map((loc) => (
                        <CommandItem
                          key={loc}
                          value={loc}
                          onSelect={(value) => {
                            handleLocationChange(value);
                            setComboboxOpen(false);
                          }}
                          className="text-gray-700 hover:bg-white/50 data-[selected=true]:bg-white/60 cursor-pointer"
                        >
                          <Check className={cn("mr-2 h-4 w-4 text-sky-600", selectedLocationName === loc ? "opacity-100" : "opacity-0")} />
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="North" className="[&_[cmdk-group-heading]]:text-sky-700 [&_[cmdk-group-heading]]:font-semibold">
                      {locationsByArea.north.map((loc) => (
                        <CommandItem
                          key={loc}
                          value={loc}
                          onSelect={(value) => {
                            handleLocationChange(value);
                            setComboboxOpen(false);
                          }}
                          className="text-gray-700 hover:bg-white/50 data-[selected=true]:bg-white/60 cursor-pointer"
                        >
                          <Check className={cn("mr-2 h-4 w-4 text-sky-600", selectedLocationName === loc ? "opacity-100" : "opacity-0")} />
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="South" className="[&_[cmdk-group-heading]]:text-sky-700 [&_[cmdk-group-heading]]:font-semibold">
                      {locationsByArea.south.map((loc) => (
                        <CommandItem
                          key={loc}
                          value={loc}
                          onSelect={(value) => {
                            handleLocationChange(value);
                            setComboboxOpen(false);
                          }}
                          className="text-gray-700 hover:bg-white/50 data-[selected=true]:bg-white/60 cursor-pointer"
                        >
                          <Check className={cn("mr-2 h-4 w-4 text-sky-600", selectedLocationName === loc ? "opacity-100" : "opacity-0")} />
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="East" className="[&_[cmdk-group-heading]]:text-sky-700 [&_[cmdk-group-heading]]:font-semibold">
                      {locationsByArea.east.map((loc) => (
                        <CommandItem
                          key={loc}
                          value={loc}
                          onSelect={(value) => {
                            handleLocationChange(value);
                            setComboboxOpen(false);
                          }}
                          className="text-gray-700 hover:bg-white/50 data-[selected=true]:bg-white/60 cursor-pointer"
                        >
                          <Check className={cn("mr-2 h-4 w-4 text-sky-600", selectedLocationName === loc ? "opacity-100" : "opacity-0")} />
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="West" className="[&_[cmdk-group-heading]]:text-sky-700 [&_[cmdk-group-heading]]:font-semibold">
                      {locationsByArea.west.map((loc) => (
                        <CommandItem
                          key={loc}
                          value={loc}
                          onSelect={(value) => {
                            handleLocationChange(value);
                            setComboboxOpen(false);
                          }}
                          className="text-gray-700 hover:bg-white/50 data-[selected=true]:bg-white/60 cursor-pointer"
                        >
                          <Check className={cn("mr-2 h-4 w-4 text-sky-600", selectedLocationName === loc ? "opacity-100" : "opacity-0")} />
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Circular Time Selector */}
            <div
              ref={circleRef}
              className="relative w-80 h-80 mt-4"
            >
              {/* Outer ring - interactive area */}
              <div
                className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/40 cursor-pointer"
                onMouseDown={handleMouseDown}
              >
                {/* Time markers around the circle (24 hours, 12am at top) */}
                {Array.from({ length: 24 }, (_, i) => {
                  const angle =
                    (i / 24) * 2 * Math.PI - Math.PI / 2;
                  const radius = 140; // Distance from center
                  const x = Math.round(160 + radius * Math.cos(angle));
                  const y = Math.round(160 + radius * Math.sin(angle));
                  const isSelected = i === selectedHour;

                  return (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full transition-all duration-200 ${isSelected
                        ? "bg-yellow-400 scale-150"
                        : "bg-white/60"
                        }`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  );
                })}

                {/* Selected time handle */}
                <div
                  className="absolute w-6 h-6 bg-yellow-400 rounded-full border-4 border-white shadow-lg transition-all duration-200 pointer-events-none"
                  style={{
                    left: `${Math.round(160 + 140 * Math.cos((selectedHour / 24) * 2 * Math.PI - Math.PI / 2))}px`,
                    top: `${Math.round(160 + 140 * Math.sin((selectedHour / 24) * 2 * Math.PI - Math.PI / 2))}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              {/* Center button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckWeather();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={isLoading || !location}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-white/40 backdrop-blur-lg border-2 border-white/50 rounded-full transition-all duration-300 hover:bg-white/50 hover:border-white/60 shadow-2xl disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed z-10"
              >
                {/* Spinning yellow line animation */}
                {isLoading && (
                  <div className="absolute inset-2 rounded-full animate-spin">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="70 220"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#facc15"
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor="#facc15"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                  <Sun
                    className={`w-12 h-12 text-yellow-400 transition-opacity ${isLoading ? "opacity-50" : ""}`}
                  />
                  <span
                    className={`text-gray-700 transition-opacity ${isLoading ? "opacity-50" : ""}`}
                  >
                    {isLoading ? "Loading..." : "Check Weather"}
                  </span>
                  <div
                    className={`text-2xl text-gray-800 mt-1 transition-opacity ${isLoading ? "opacity-50" : ""}`}
                  >
                    {getTimeString(selectedHour)}
                  </div>
                  <span
                    className={`text-xs text-gray-600 transition-opacity ${isLoading ? "opacity-50" : ""}`}
                  >
                    {(
                      isTomorrow(selectedHour, currentHour) ? (
                        <span className="flex items-center gap-1">
                          <span>Tomorrow</span>
                          <span className="text-[10px]">(+{getHoursFromNow(selectedHour, currentHour)}h)</span>
                        </span>
                      ) : getHoursFromNow(selectedHour, currentHour) === 0 ? (
                        "Now"
                      ) : (
                        `+${getHoursFromNow(selectedHour, currentHour)}h`
                      )
                    )}
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Weather Display State */
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            {/* Temperature Card */}
            <div className="glass rounded-3xl p-8 shadow-2xl min-w-[320px] max-w-[360px] w-full">
              <div className="flex flex-col items-center gap-4">
                <Sun className="w-12 h-12 text-yellow-400" />
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">
                    {selectedLocationName} {isTomorrow(selectedHour, currentHour) && <span className="font-semibold text-gray-800">Tomorrow</span>} at {getTimeString(selectedHour)}
                  </p>
                  <p className="text-gray-800 text-xl mb-3">
                    {weatherData?.forecast ?? "Weather data unavailable"}
                  </p>
                  <p className="text-gray-700 text-lg mb-1">
                    Temperature
                  </p>
                  <p className="text-6xl text-gray-800">
                    {weatherData?.temp ? Math.round(weatherData.temp) : "--"}°
                  </p>
                  <p className="text-gray-600 text-base mt-1">
                    Celsius
                  </p>
                </div>
              </div>
            </div>

            {/* Precipitation Card */}
            <div className="glass rounded-3xl p-8 shadow-2xl min-w-[320px] max-w-[360px] w-full">
              <div className="flex flex-col items-center gap-4">
                <CloudRain className="w-12 h-12 text-blue-400" />
                <div className="text-center">
                  <p className="text-gray-700 text-lg mb-1">
                    Precipitation
                  </p>
                  <p className="text-6xl text-gray-800">
                    {weatherData ? Math.round((weatherData.pop ?? 0) * 100) : "--"}%
                  </p>
                  <p className="text-gray-600 text-base mt-1">
                    Chance of rain
                  </p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setShowWeather(false);
                setWeatherData(null);
                setSelectedHour(getCurrentHour());
              }}
              className="mt-4 px-8 py-3 glass rounded-xl text-gray-700 transition-all duration-300 hover:bg-white/40 hover:border-white/60"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}