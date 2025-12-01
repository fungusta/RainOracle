"use client";

import { useState } from "react";
import { Sun, CloudRain } from 'lucide-react';

// Mock weather data
const temperature = 72;
const precipitation = 25;


export default function Home() {
  const [showWeather, setShowWeather] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');

  const handleCheckWeather = () => {
    if (!location || !time) return; // Don't proceed if fields are empty

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowWeather(true);
    }, 2000); // 2 second loading time
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {!showWeather ? (
          /* Initial State - Button with Inputs */
          <div className="flex flex-col items-center gap-6">
            {/* Location Input */}
            <div className="w-80">
              <label className="block text-gray-700 mb-2 ml-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full px-6 py-4 glass rounded-2xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white/40 focus:border-white/60"
              />
            </div>

            {/* Time Input */}
            <div className="w-80">
              <label className="block text-gray-700 mb-2 ml-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-6 py-4 glass rounded-2xl text-gray-800 transition-all duration-300 focus:outline-none focus:bg-white/40 focus:border-white/60"
              />
            </div>

            {/* Check Weather Button */}
            <button
              onClick={handleCheckWeather}
              disabled={isLoading || !location || !time}
              className="glass group relative w-48 h-48 rounded-full text-white transition-all duration-300 hover:bg-white/40 hover:scale-110 hover:border-white/60 shadow-2xl disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {/* Spinning yellow line animation */}
              {isLoading && (
                <div className="absolute inset-2 rounded-full animate-spin">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
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
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
                        <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              <div className="flex flex-col items-center justify-center gap-2">
                <Sun className={`w-16 h-16 text-yellow-400 transition-opacity ${isLoading ? 'opacity-50' : ''}`} />
                <span className={`text-xl text-gray-700 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
                  {isLoading ? 'Loading...' : 'Check Weather'}
                </span>
              </div>
            </button>
          </div>
        ) : (
          /* Weather Display State */
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            {/* Temperature Card */}
            <div className="glass rounded-3xl p-12 shadow-2xl min-w-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Sun className="w-16 h-16 text-yellow-400" />
                <div className="text-center">
                  <p className="text-gray-700 text-xl mb-2">Temperature</p>
                  <p className="text-8xl text-gray-800">{temperature}°</p>
                  <p className="text-gray-600 text-lg mt-2">Fahrenheit</p>
                </div>
              </div>
            </div>

            {/* Precipitation Card */}
            <div className="glass rounded-3xl p-12 shadow-2xl min-w-[400px]">
              <div className="flex flex-col items-center gap-4">
                <CloudRain className="w-16 h-16 text-blue-400" />
                <div className="text-center">
                  <p className="text-gray-700 text-xl mb-2">Precipitation</p>
                  <p className="text-8xl text-gray-800">{precipitation}%</p>
                  <p className="text-gray-600 text-lg mt-2">Chance of rain</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setShowWeather(false)}
              className="glass mt-4 px-8 py-3 rounded-xl text-gray-700 transition-all duration-300 hover:bg-white/40 hover:border-white/60"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
