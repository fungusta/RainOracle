
# 🌧️ **RainOracle**

*A minimalist one-button weather application.*

👉 **Live Website:** [Rain Oracle](https://rain-oracle-nu.vercel.app/)

RainOracle gives users instant, frictionless weather updates with a single tap. The app focuses on clarity, speed, and a polished visual experience through dynamic animated backgrounds that reflect real-time weather conditions.

---

## ⭐ **Features**

### **1. One-Tap Weather Update**

* Press a single button to get the current weather immediately.
* Designed for fast, zero-friction usage.

### **2. Dynamic Animated Backgrounds**

* Background changes automatically depending on the weather.

### **3. Accurate Weather Categorisation**

* Forecasts are interpreted using reliable weather condition codes.
* Conditions are mapped to clear categories such as Rain, Clouds, Thunderstorm, Clear, etc.

### **4. Location-Based Forecast**

* Detects the user’s location to provide relevant weather information.
* Selects the nearest available forecast area.

### **5. Clean and Minimal Interface**

* Single-screen design.
* No clutter, no complex navigation.
* Optimised for speed and simplicity.

### **6. Lightweight & Mobile-Ready**

* Designed to feel fast on both desktop and mobile browsers.
* Minimal dependencies and efficient rendering.

---

## 🗂️ **Tech Stack**

| Area         | Technology                    |
| ------------ | ----------------------------- |
| Frontend     | React + Next.js + TypeScript  |
| Styling      | Tailwind CSS                  |
| Weather Data | NEA (Singapore) + OpenWeather |
| Location     | Browser Geolocation           |
| Deployment   | Vercel                        |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create `.env.local`:

```
OPENWEATHER_API_KEY=
SG_WEATHER_API_KEY=
```

### 3. Start the development server

```bash
npm run dev
```

---
